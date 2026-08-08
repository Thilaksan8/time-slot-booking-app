const Booking = require("../models/Booking");

// @desc    Create a new booking
// @route   POST /booking
// @access  Private (USER, ADMIN)
const createBooking = async (req, res) => {
    try {
        const { date, timeSlot, category, note, name } = req.body;

        if (!date || !timeSlot || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide date, timeSlot, and category"
            });
        }

        const existingBooking = await Booking.findOne({
            date,
            timeSlot
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: "This time slot is already booked."
            });
        }

        const booking = await Booking.create({
            user: req.user._id,
            name: name || req.user.name,
            date,
            timeSlot,
            category,
            note
        });

        res.status(201).json({
            success: true,
            message: "Booking Created Successfully",
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get bookings (USER sees own bookings, ADMIN sees all)
// @route   GET /booking
// @access  Private (USER, ADMIN)
const getBookings = async (req, res) => {
    try {
        let bookings;

        if (req.user.role === "ADMIN") {
            // ADMIN can view all bookings across all users
            bookings = await Booking.find().populate("user", "name email role");
        } else {
            // Regular USER can only view their own bookings
            bookings = await Booking.find({ user: req.user._id });
        }

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update an existing booking (USER can only update own, ADMIN can update any)
// @route   PUT /booking/:id
// @access  Private (USER, ADMIN)
const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, timeSlot } = req.body;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Authorization check: Must be owner OR an ADMIN
        if (req.user.role !== "ADMIN" && booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You are not authorized to update another user's booking"
            });
        }

        if (date && timeSlot) {
            const duplicate = await Booking.findOne({
                date,
                timeSlot,
                _id: { $ne: id }
            });

            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message: "This time slot is already booked by someone else."
                });
            }
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Booking updated successfully.",
            booking: updatedBooking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete a booking (USER can only delete own, ADMIN can delete any)
// @route   DELETE /booking/:id
// @access  Private (USER, ADMIN)
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Authorization check: Must be owner OR an ADMIN
        if (req.user.role !== "ADMIN" && booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You are not authorized to delete another user's booking"
            });
        }

        await Booking.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Booking deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createBooking,
    getBookings,
    updateBooking,
    deleteBooking
};