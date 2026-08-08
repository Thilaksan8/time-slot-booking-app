const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// SHA-256 Hash helper for refresh tokens
const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

// Generate short-lived Access Token & longer-lived Refresh Token
const generateTokens = (id) => {
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "15m"
    });

    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
    });

    return { accessToken, refreshToken };
};

// Cookie Options Helper
const sendRefreshTokenCookie = (res, refreshToken) => {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

// @desc    Register a new user (Strictly forces role: USER)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email, and password"
            });
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Check for duplicate email
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered"
            });
        }

        // Create user (SECURITY: Explicitly force role to 'USER' to prevent privilege escalation)
        const user = await User.create({
            name,
            email,
            password,
            role: "USER"
        });

        // Generate Tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Store SHA-256 hash of refresh token
        user.refreshTokenHash = hashToken(refreshToken);
        await user.save({ validateBeforeSave: false });

        // Set HttpOnly cookie
        sendRefreshTokenCookie(res, refreshToken);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error during registration"
        });
    }
};

// @desc    Authenticate user & get tokens
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        // Check if user exists & select password field explicitly
        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password match
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate Tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Update stored refresh token hash
        user.refreshTokenHash = hashToken(refreshToken);
        await user.save({ validateBeforeSave: false });

        // Set HttpOnly cookie
        sendRefreshTokenCookie(res, refreshToken);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error during login"
        });
    }
};

// @desc    Refresh Access Token & Rotate Refresh Token
// @route   POST /api/auth/refresh
// @access  Public (via Refresh Token)
const refresh = async (req, res) => {
    try {
        // Support token from cookie, body, or header fallback
        const incomingRefreshToken =
            req.cookies?.refreshToken ||
            req.body?.refreshToken ||
            req.headers["x-refresh-token"];

        if (!incomingRefreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is missing"
            });
        }

        // Verify token signature & expiry
        let decoded;
        try {
            decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            res.clearCookie("refreshToken");
            return res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token"
            });
        }

        // Hash incoming refresh token and compare against stored hash
        const hashedIncomingToken = hashToken(incomingRefreshToken);
        const user = await User.findById(decoded.id).select("+refreshTokenHash");

        if (!user || !user.refreshTokenHash || user.refreshTokenHash !== hashedIncomingToken) {
            res.clearCookie("refreshToken");
            return res.status(401).json({
                success: false,
                message: "Refresh token has been revoked or is invalid"
            });
        }

        // TOKEN ROTATION: Issue new Access Token AND new Refresh Token
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

        // Update database with new hashed refresh token
        user.refreshTokenHash = hashToken(newRefreshToken);
        await user.save({ validateBeforeSave: false });

        // Set new HttpOnly cookie
        sendRefreshTokenCookie(res, newRefreshToken);

        res.status(200).json({
            success: true,
            message: "Tokens refreshed successfully",
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        console.error("Refresh Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error during token refresh"
        });
    }
};

// @desc    Logout user & invalidate refresh token
// @route   POST /api/auth/logout
// @access  Public / Private
const logout = async (req, res) => {
    try {
        const incomingRefreshToken =
            req.cookies?.refreshToken ||
            req.body?.refreshToken ||
            req.headers["x-refresh-token"];

        if (incomingRefreshToken) {
            try {
                const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
                const user = await User.findById(decoded.id);
                if (user) {
                    user.refreshTokenHash = null;
                    await user.save({ validateBeforeSave: false });
                }
            } catch (err) {
                // Token invalid or expired, ignore DB update
            }
        } else if (req.user) {
            req.user.refreshTokenHash = null;
            await req.user.save({ validateBeforeSave: false });
        }

        res.clearCookie("refreshToken");

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error during logout"
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error fetching profile"
        });
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout,
    getMe
};
