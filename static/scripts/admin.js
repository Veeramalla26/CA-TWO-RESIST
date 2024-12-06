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
                    setTimeout(() => {
                        alert(result.message);
                        window.location.href = '/view_hotels';
                    }, 3000);
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

    if (viewHotelsButton) {
        viewHotelsButton.addEventListener('click', function() {
            window.location.href = '/view_hotels';
        });
    }

});
