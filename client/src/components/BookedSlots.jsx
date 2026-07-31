function BookedSlots({bookings}) {
    console.log(bookings);
    return (
        <div>
            <h2>Booked Slots</h2>
            {bookings.map((booking) => (
                <div className="booking-card" key={booking._id}>

                    <p>👤 <strong>{booking.name}</strong></p>

                    <p>📅 {booking.date}</p>

                    <p>⏰ {booking.timeSlot}</p>

                    <p>🏷 {booking.category}</p>

                </div>
            ))}
        </div>
    );
}

export default BookedSlots;