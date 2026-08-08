const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    timeSlot: {
        type: String,
        required: true
    },
    
    category: {
        type: String,
        required: true
    },

    note: {
        type: String
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);