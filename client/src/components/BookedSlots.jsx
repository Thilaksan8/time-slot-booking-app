function BookedSlots({bookings}) {
    console.log(bookings);
    return (
        <div>
            <h2>Booked Slots</h2>
            {bookings.map((booking) => (
                <div key={booking._id}>
                    <p><strong>Name:</strong>{booking.name}</p>    
                    <p><strong>Date:</strong>{booking.date}</p>
                    <p><strong>Time:</strong>{booking.time}</p>
                    <p><strong>Email:</strong>{booking.email}</p>
                    <hr/> 
                </div>
            ))}
        </div>
    );
}

export default BookedSlots;