import { useState,useEffect } from "react";

const timeSlots = [
    "9:00 - 9:30 AM",
    "9:30 - 10:00 AM",
    "10:00 - 10:30 AM",
    "11:00 - 11:30 AM"
];


function BookingForm({fetchBookings,bookings,editingBooking,setEditingBooking}) {

    const [message, setMessage] = useState("");

    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [category, setCategory] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {

        if (editingBooking) {

            setName(editingBooking.name);
            setDate(editingBooking.date);
            setTimeSlot(editingBooking.timeSlot);
            setCategory(editingBooking.category);
            setNote(editingBooking.note);

        }

    }, [editingBooking]);

    const handleSubmit = () => {

        const url = editingBooking
            ? `https://time-slot-booking-api.onrender.com/${editingBooking._id}`
            : "https://time-slot-booking-api.onrender.com/booking";

        const method = editingBooking ? "PUT" : "POST";
        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                date,
                timeSlot,
                category,
                note
            })
        })
        .then(async (response) => {

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return data;
        })
        .then(data => {
            setMessage(data.message);
            fetchBookings(); // Refresh the bookings after a successful submission
            setName("");
            setDate("");
            setTimeSlot("");
            setCategory("");
            setNote("");
            setEditingBooking(null);
        })
        .catch((error) => {
            setMessage(error.message);
        });
    };

    return (
        <div>

            <h2>Book a Time Slot</h2>

            {message && (
                <div className="message">
                    {message}
            </div>
            )}

            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <br/>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />  
            <br/>
            <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
            >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot) => {

                    const isBooked = bookings.some(
                        (booking) =>
                            booking.date === date &&
                            booking.timeSlot === slot
            );

            return (
                <option 
                    key={slot} 
                    value={slot} 
                    disabled={isBooked}
                >
                    {isBooked ? `${slot} (Booked)` : slot}
                </option>
    );

})}
            </select>
            <br/>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}   
            >
                <option value="">Select a category</option>
                <option>Meeting</option>
                <option>Interview</option>
                <option>Discussion</option>
                <option>Consultation</option>
            </select>
            <br/>
            <textarea
                rows="4"
                placeholder="Enter any notes"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            ></textarea>
            <br/>
            <button onClick={handleSubmit}>{editingBooking ? "Update Booking" : "Book Slot"}</button>
            
                
        </div>
    );

}

export default BookingForm;