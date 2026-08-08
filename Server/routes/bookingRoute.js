const express = require("express");
const router = express.Router();
const { createBooking, getBookings, updateBooking, deleteBooking } = require("../controllers/BookingController");
const { protect } = require("../middleware/authMiddleware");

// All booking routes require authentication
router.use(protect);

router.post("/", createBooking);
router.get("/", getBookings);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

module.exports = router;