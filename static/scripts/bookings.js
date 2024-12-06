
document.addEventListener('DOMContentLoaded', async function() { 
    try {
        const response = await fetch('/my_bookings');
        const result = await response.json();

        if (response.ok) {
            let bookingsList = '';
            result.forEach(booking => {
                bookingsList += `
                    <div class="booking-card">
                        <h3>${booking.hotel_name}</h3>
                        <p>Location: ${booking.location}</p>
                        <p>Start Date: ${booking.start_date}</p>
                        <p>End Date: ${booking.end_date}</p>
                    </div>`;
            });
            document.getElementById('bookingsList').innerHTML = bookingsList;
        } else {
            document.getElementById('bookingsList').innerHTML = '<p>Failed to fetch bookings. Please try again later.</p>';
        }
    } catch (error) {
        document.getElementById('bookingsList').innerHTML = '<p>An error occurred while fetching bookings. Please try again later.</p>';
    }
});
