// JavaScript code for handling adding and viewing hotels on dashboard

document.addEventListener('DOMContentLoaded', function() {
    const addHotelForm = document.getElementById('add-hotel-form');
    const messageDiv = document.getElementById('message');
    const viewHotelsButton = document.getElementById('view-hotels-btn');
    const hotelsContainer = document.getElementById('hotels-container');

    // Form submission handler to add a hotel
    if (addHotelForm) {
        addHotelForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            console.log("Form submission triggered");

            // Extract values from the form fields
            const hotelName = document.getElementById('name').value;
            const hotelLocation = document.getElementById('location').value;
            const hotelDescription = document.getElementById('description').value;
            const bookingLink = document.getElementById('link').value;

            console.log("Extracted form data:", {
                name: hotelName,
                location: hotelLocation,
                description: hotelDescription,
                link: bookingLink
            });

            try {
                const response = await fetch('/api/add_hotel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: hotelName,
                        location: hotelLocation,
                        description: hotelDescription,
                        link: bookingLink
                    })
                });

                console.log("Response received:", response);

                const result = await response.json();
                console.log("Response JSON:", result);

                if (response.ok) {
                    messageDiv.textContent = result.message;
                    messageDiv.style.color = 'green';
                    addHotelForm.reset();
                } else {
                    messageDiv.textContent = result.message;
                    messageDiv.style.color = 'red';
                }
            } catch (error) {
                console.error('Error adding hotel:', error);
                messageDiv.textContent = 'An error occurred while adding the hotel. Please try again later.';
                messageDiv.style.color = 'red';
            }
        });
    }

    // Event listener for viewing hotels
    if (viewHotelsButton) {
        viewHotelsButton.addEventListener('click', async function() {
            try {
                console.log("View hotels button clicked");

                const response = await fetch('/api/get_hotels', {
                    method: 'GET',
                });

                console.log("Response received:", response);

                const result = await response.json();
                console.log("Response JSON:", result);

                if (response.ok) {
                    let hotelsList = '';
                    result.hotels.forEach(hotel => {
                        hotelsList += `
                            <div class="hotel-card">
                                <h3>${hotel.name}</h3>
                                <p>Location: ${hotel.location}</p>
                                <p>Description: ${hotel.description}</p>
                                <p><a href="${hotel.link}" target="_blank">Booking Link</a></p>
                            </div>`;
                    });
                    hotelsContainer.innerHTML = hotelsList;
                } else {
                    hotelsContainer.innerHTML = '<p>Failed to fetch hotels. Please try again later.</p>';
                    console.error('Failed to fetch hotels:', result.message);
                }
            } catch (error) {
                hotelsContainer.innerHTML = '<p>An error occurred while fetching hotels. Please try again later.</p>';
                console.error('Error fetching hotels:', error);
            }
        });
    }
});
