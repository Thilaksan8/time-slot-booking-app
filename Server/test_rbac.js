const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const API_BASE = 'http://127.0.0.1:5000';

function makeRequest(pathStr, method, data = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(`${API_BASE}${pathStr}`);
        const options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                let parsedBody;
                try {
                    parsedBody = JSON.parse(body);
                } catch (e) {
                    parsedBody = body;
                }
                resolve({
                    status: res.statusCode,
                    body: parsedBody
                });
            });
        });

        req.on('error', (err) => reject(err));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function waitForServer(retries = 10) {
    for (let i = 0; i < retries; i++) {
        try {
            await new Promise((resolve, reject) => {
                const req = http.get('http://127.0.0.1:5000/', (res) => resolve(res));
                req.on('error', reject);
            });
            console.log("✅ Server is responding on http://127.0.0.1:5000/");
            return true;
        } catch (e) {
            console.log(`Waiting for server to start... (${i + 1}/${retries})`);
            await new Promise((res) => setTimeout(res, 1000));
        }
    }
    throw new Error("Server failed to respond within timeout");
}

async function createAdminInDB(email, password) {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        throw new Error('MONGO_URI must be set to run the RBAC test suite');
    }
    await mongoose.connect(MONGO_URI);

    // User Schema definition for direct test setup
    const userSchema = new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        role: String,
        refreshTokenHash: String
    });

    const User = mongoose.models.User || mongoose.model("User", userSchema);

    let admin = await User.findOne({ email });
    if (!admin) {
        // Register via API first to get proper bcrypt hash
        await makeRequest('/api/auth/register', 'POST', { name: "System Admin", email, password });
        admin = await User.findOne({ email });
    }

    admin.role = "ADMIN";
    await admin.save();
    console.log("   Promoted user to ADMIN role in MongoDB:", admin.email);
    await mongoose.disconnect();
}

async function runTests() {
    console.log("==================================================");
    console.log("  PHASE 3 ROLE-BASED ACCESS CONTROL (RBAC) SUITE  ");
    console.log("==================================================");
    await waitForServer();

    const timestamp = Date.now();
    const userA_email = `usera_${timestamp}@example.com`;
    const userB_email = `userb_${timestamp}@example.com`;
    const admin_email = `admin_${timestamp}@example.com`;
    const commonPassword = "password123";

    // ----------------------------------------------------
    // SETUP: Register User A, User B, and Create Admin
    // ----------------------------------------------------
    console.log("\n0. Setting up test users & admin...");
    const regA = await makeRequest('/api/auth/register', 'POST', { name: "User A", email: userA_email, password: commonPassword });
    const tokenA = regA.body.accessToken;

    const regB = await makeRequest('/api/auth/register', 'POST', { name: "User B", email: userB_email, password: commonPassword });
    const tokenB = regB.body.accessToken;

    await createAdminInDB(admin_email, commonPassword);
    const loginAdmin = await makeRequest('/api/auth/login', 'POST', { email: admin_email, password: commonPassword });
    const tokenAdmin = loginAdmin.body.accessToken;
    console.log("   ✅ Users and Admin created successfully.");

    // ----------------------------------------------------
    // TEST 1: Unauthenticated Protection
    // ----------------------------------------------------
    console.log("\n1. Testing Unauthenticated Request Rejection...");
    const unauthRes = await makeRequest('/booking', 'GET', null, null);
    console.log("   GET /booking without token status:", unauthRes.status);
    if (unauthRes.status !== 401) {
        console.error("❌ Unauthenticated request was not rejected with 401!");
        process.exit(1);
    }
    console.log("   ✅ PASSED: Unauthenticated requests correctly rejected with 401.");

    // ----------------------------------------------------
    // TEST 2: USER Operations (Own Resource Access)
    // ----------------------------------------------------
    console.log("\n2. Testing USER creating & managing OWN booking...");
    const createBookingRes = await makeRequest('/booking', 'POST', {
        date: `2026-09-01`,
        timeSlot: `10:00 - 10:30 AM`,
        category: `Interview`,
        note: `User A booking`
    }, tokenA);

    console.log("   POST /booking status:", createBookingRes.status);
    const bookingA_id = createBookingRes.body?.booking?._id;

    if (createBookingRes.status !== 201 || !bookingA_id) {
        console.error("❌ User A failed to create booking!");
        process.exit(1);
    }

    const getA_res = await makeRequest('/booking', 'GET', null, tokenA);
    console.log("   GET /booking for User A count:", getA_res.body?.count);
    if (getA_res.status !== 200 || getA_res.body?.count !== 1) {
        console.error("❌ User A booking list scope check failed!");
        process.exit(1);
    }
    console.log("   ✅ PASSED: USER successfully created and viewed own booking.");

    // ----------------------------------------------------
    // TEST 3: USER Ownership Violation (Cross-User Protection)
    // ----------------------------------------------------
    console.log("\n3. Testing USER B attempting to modify/delete USER A's booking (Ownership Violation)...");

    // User B attempts to view booking list (should NOT see User A's booking)
    const getB_res = await makeRequest('/booking', 'GET', null, tokenB);
    console.log("   GET /booking for User B count:", getB_res.body?.count);
    if (getB_res.body?.count !== 0) {
        console.error("❌ User B saw User A's booking!");
        process.exit(1);
    }

    // User B attempts to UPDATE User A's booking
    const updateViolation = await makeRequest(`/booking/${bookingA_id}`, 'PUT', { note: "Hacked Note" }, tokenB);
    console.log("   PUT /booking/:id by User B status:", updateViolation.status);
    if (updateViolation.status !== 403) {
        console.error("❌ Cross-user update violation was NOT rejected with 403!");
        process.exit(1);
    }

    // User B attempts to DELETE User A's booking
    const deleteViolation = await makeRequest(`/booking/${bookingA_id}`, 'DELETE', null, tokenB);
    console.log("   DELETE /booking/:id by User B status:", deleteViolation.status);
    if (deleteViolation.status !== 403) {
        console.error("❌ Cross-user delete violation was NOT rejected with 403!");
        process.exit(1);
    }
    console.log("   ✅ PASSED: Cross-user modification attempts strictly rejected with 403 Forbidden.");

    // ----------------------------------------------------
    // TEST 4: USER Access to ADMIN-Only Route
    // ----------------------------------------------------
    console.log("\n4. Testing USER A accessing ADMIN-only route (GET /api/admin/users)...");
    const adminAccessViolation = await makeRequest('/api/admin/users', 'GET', null, tokenA);
    console.log("   GET /api/admin/users by User A status:", adminAccessViolation.status);
    if (adminAccessViolation.status !== 403) {
        console.error("❌ USER accessing ADMIN endpoint was NOT rejected with 403!");
        process.exit(1);
    }
    console.log("   ✅ PASSED: Regular USER access to ADMIN route rejected with 403 Forbidden.");

    // ----------------------------------------------------
    // TEST 5: ADMIN Access (Full System Operations)
    // ----------------------------------------------------
    console.log("\n5. Testing ADMIN user full access capabilities...");

    // Admin fetches all system bookings
    const adminGetBookings = await makeRequest('/booking', 'GET', null, tokenAdmin);
    console.log("   ADMIN GET /booking status:", adminGetBookings.status, "| Total system bookings:", adminGetBookings.body?.count);

    // Admin updates User A's booking
    const adminUpdate = await makeRequest(`/booking/${bookingA_id}`, 'PUT', { note: "Updated by Admin" }, tokenAdmin);
    console.log("   ADMIN PUT /booking/:id status:", adminUpdate.status);

    // Admin accesses Admin-only users endpoint
    const adminGetUsers = await makeRequest('/api/admin/users', 'GET', null, tokenAdmin);
    console.log("   ADMIN GET /api/admin/users status:", adminGetUsers.status, "| Total users:", adminGetUsers.body?.count);

    // Admin deletes User A's booking
    const adminDelete = await makeRequest(`/booking/${bookingA_id}`, 'DELETE', null, tokenAdmin);
    console.log("   ADMIN DELETE /booking/:id status:", adminDelete.status);

    if (
        adminGetBookings.status !== 200 ||
        adminUpdate.status !== 200 ||
        adminGetUsers.status !== 200 ||
        adminDelete.status !== 200
    ) {
        console.error("❌ Admin authorization check failed!");
        process.exit(1);
    }
    console.log("   ✅ PASSED: ADMIN successfully executed all admin management operations.");

    console.log("\n==================================================");
    console.log("  🎉 ALL PHASE 3 RBAC TESTS PASSED PERFECTLY!   ");
    console.log("==================================================");
    process.exit(0);
}

runTests().catch(err => {
    console.error("Test execution error:", err);
    process.exit(1);
});
