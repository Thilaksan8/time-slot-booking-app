function BookedSlots({bookings, fetchBookings,setEditingBooking}) {
    console.log(bookings);
    const handleDelete = (id) => {

        fetch(`https://time-slot-booking-api.onrender.com/${id}`, {
            method: "DELETE"
        })
        .then((response) => response.json())
        .then((data) => {

            console.log(data);

            fetchBookings();

        })
        .catch((error) => {
            console.error(error);
        });

    };

    return (
        <div>
            <h2>Booked Slots</h2>
            {bookings.map((booking) => (
                <div className="booking-card" key={booking._id}>

                    <p>👤 <strong>{booking.name}</strong></p>

                    <p>📅 {booking.date}</p>

                    <p>⏰ {booking.timeSlot}</p>

                    <p>🏷 {booking.category}</p>

                    <div className="button-group">

                        <button onClick={() => {console.log(booking) ; setEditingBooking(booking)}}>
                            Edit
                        </button>

                        <button onClick={() => handleDelete(booking._id)}>
                            Delete
                        </button>

                    </div>

                </div>
            ))}
        </div>
    );
}

export default BookedSlots;