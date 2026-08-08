const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authorizeMiddleware");

// All admin routes require Authentication AND ADMIN Authorization
router.use(protect);
router.use(authorizeRoles("ADMIN"));

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/ADMIN
router.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
