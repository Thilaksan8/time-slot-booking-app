import BookingForm from "../components/BookingForm";
import AvailableSlots from "../components/AvailableSlots";
import BookedSlots from "../components/BookedSlots";
import { useEffect, useState } from "react";



function Home() {

    const [bookings, setBookings] = useState([]);

     

    const fetchBookings = () => {

    fetch("http://localhost:5000/booking")
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
        <>
            <h1>Time Slot Booking</h1>
            <p>Book your appointment easily.</p>

            <BookingForm fetchBookings={fetchBookings} />

            <AvailableSlots />

            <BookedSlots bookings={bookings} />
        </>
    );
}

export default Home;