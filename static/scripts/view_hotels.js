document.addEventListener('DOMContentLoaded', async function() { 
    try {
        const response = await fetch('/api/get_hotels');
        const result = await response.json();

        if (response.ok) {
            let hotelsList = '';
            result.hotels.forEach(hotel => {
                hotelsList += `
                    <div class="hotel-card" data-id="${hotel.id}">
                        <h3>${hotel.name}</h3>
                        <p>Location: ${hotel.location}</p>
                        <p>Description: ${hotel.description}</p>
                        <p><a href="${hotel.link}" target="_blank">Booking Link</a></p>
                        <button class="edit-hotel-btn button" data-id="${hotel.id}">Edit</button>
                    </div>`;
            });
            document.getElementById('hotels-container').innerHTML = hotelsList;

            const editButtons = document.querySelectorAll('.edit-hotel-btn');

            editButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const hotelId = event.target.getAttribute('data-id');
                    // Navigate to the edit page for the specific hotel
                    window.location.href = `/edit_hotel/${hotelId}`;
                });
            });
        } else {
            document.getElementById('hotels-container').innerHTML = '<p>Failed to fetch hotels. Please try again later.</p>';
        }
    } catch (error) {
        document.getElementById('hotels-container').innerHTML = '<p>An error occurred while fetching hotels. Please try again later.</p>';
    }
});