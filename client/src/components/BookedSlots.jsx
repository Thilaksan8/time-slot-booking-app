function BookedSlots({bookings, fetchBookings}) {
    console.log(bookings);
    const handleDelete = (id) => {

        fetch(`http://localhost:5000/booking/${id}`, {
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

                    <button onClick={() => handleDelete(booking._id)}>
                        Delete
                    </button>

                </div>
            ))}
        </div>
    );
}

export default BookedSlots;