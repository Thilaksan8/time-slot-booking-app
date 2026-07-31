const Booking = require("../models/Booking");

const createBooking = async (req, res) => {

    try {
        console.log("Request received:", req.body);
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

module.exports = {
    createBooking
};  