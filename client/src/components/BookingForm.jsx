import { useState } from "react";

function BookingForm() {

    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [category, setCategory] = useState("");
    const [note, setNote] = useState("");

    const handleSubmit = () => {
        console.log(name);
        console.log(date);
        console.log(timeSlot);
        console.log(category);
        console.log(note);
    }

    return (
        <div>

            <h2>Book a Time Slot</h2>

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
                <option >9:00 - 9:30 AM</option>
                <option >9:30 - 10:00 AM</option>
                <option >10:00 - 10:30 AM</option>
                <option >11:00 - 11:30 AM</option>
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
            <button onClick={handleSubmit}>Book Slot</button>
            
                
        </div>
    );

}

export default BookingForm;