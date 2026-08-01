import BookingForm from "../components/BookingForm";
import BookedSlots from "../components/BookedSlots";
import { useEffect, useState } from "react";



function Home() {

    const [bookings, setBookings] = useState([]);

    const [editingBooking, setEditingBooking] = useState(null);

     

    const fetchBookings = () => {

    fetch("https://time-slot-booking-api.onrender.com/booking")
        .then((response) => response.json())
        .then((data) => {
            setBookings(data);
        })
        .catch((error) => {
            console.error(error);
        });

};
    useEffect(() => {
        fetchBookings();    
    }, []);


    return (
    <div className="container">

        <h1>📅 Time Slot Booking</h1>
        <p>Book your appointment easily.</p>

        <div className="content">

            <div className="left-panel">

                <BookingForm
                    fetchBookings={fetchBookings}
                    bookings={bookings}
                    editingBooking={editingBooking}
                    setEditingBooking={setEditingBooking}
                />

               

            </div>

            <div className="right-panel">

                <BookedSlots
                    bookings={bookings}
                    fetchBookings={fetchBookings}
                    setEditingBooking={setEditingBooking}
                />

            </div>

        </div>

    </div>
);
}

export default Home;