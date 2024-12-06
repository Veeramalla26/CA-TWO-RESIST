document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/api/get_hotels');
        const result = await response.json();

        if (response.ok) {
            let hotelsList = '';
            result.hotels.forEach(hotel => {
                hotelsList += `
                    <div class="hotel-card">
                        <h3>${hotel.name}</h3>
                        <p>Location: ${hotel.location}</p>
                        <p>Description: ${hotel.description}</p>
                        <button class="button book-hotel-btn" data-id="${hotel.id}">Book</button>
                    </div>`;
            });
            document.getElementById('hotels-container').innerHTML = hotelsList;

            // Add event listeners to redirect to booking page
            const bookButtons = document.querySelectorAll('.book-hotel-btn');
            bookButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const hotelId = event.target.getAttribute('data-id');
                    window.location.href = `/book_hotel/${hotelId}`;
                });
            });
        } else {
            document.getElementById('hotels-container').innerHTML = '<p>Failed to fetch hotels. Please try again later.</p>';
        }
    } catch (error) {
        document.getElementById('hotels-container').innerHTML = '<p>An error occurred while fetching hotels. Please try again later.</p>';
    }
});
