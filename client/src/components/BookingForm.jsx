import { useState } from "react";

function BookingForm() {

    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [category, setCategory] = useState("");
    const [note, setNote] = useState("");

    return (
        <div>

            <h2>Book a Time Slot</h2>

            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <p>{name}</p>

        </div>
    );

}

export default BookingForm;