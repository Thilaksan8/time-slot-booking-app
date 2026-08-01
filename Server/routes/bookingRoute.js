const express = require("express");

const router = express.Router();

const { createBooking,getBookings,updateBooking,deleteBooking } = require("../controllers/BookingControllerookingController");

router.post("/", createBooking);

router.get("/",getBookings);

router.put("/:id", updateBooking);

router.delete("/:id", deleteBooking);



module.exports = router;