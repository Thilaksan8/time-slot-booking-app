const Booking = require("../models/Booking");

const createBooking = async (req, res) => {

    try {
        console.log("Request received:", req.body);
        const { date, timeSlot } = req.body;
        const existingBooking = await Booking.findOne({
            date,
            timeSlot
        });

        if (existingBooking) {
            return res.status(400).json({
                message: "This time slot is already booked."
            });
        }
        const booking = await Booking.create(req.body);

        res.status(201).json({
            message: "Booking Created Successfully",
            booking
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const getBookings = async (req, res) => {

    try {

        const bookings = await Booking.find();

        res.status(200).json(bookings);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const updateBooking = async (req, res) => {

    try {

        const { id } = req.params;
        const { date, timeSlot } = req.body;

        const duplicate = await Booking.findOne({
            date,
            timeSlot,
            _id: { $ne: id }
        });

        if (duplicate) {
            return res.status(400).json({
                message: "This time slot is already booked by someone else."
            });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            message: "Booking updated successfully.",
            booking: updatedBooking
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};      

const deleteBooking = async (req, res) => {

    try {

        const { id } = req.params;

        await Booking.findByIdAndDelete(id);

        res.status(200).json({
            message: "Booking deleted successfully."
        });

    } catch (error) {

        res.status(500).json({
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