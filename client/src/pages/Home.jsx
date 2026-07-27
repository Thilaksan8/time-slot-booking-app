import BookingForm from "../components/BookingForm";
import AvailableSlots from "../components/AvailableSlots";
import BookedSlots from "../components/BookedSlots";

function Home() {
    return (
        <>
            <h1>Time Slot Booking</h1>
            <p>Book your appointment easily.</p>

            <BookingForm />

            <AvailableSlots />

            <BookedSlots />
        </>
    );
}

export default Home;