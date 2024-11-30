document.addEventListener('DOMContentLoaded', function() {
    const addHotelForm = document.getElementById('add-hotel-form');
    const messageDiv = document.getElementById('message');

    
    addHotelForm.addEventListener('submit', async function(event) {
        event.preventDefault();
     
        const hotelName = document.getElementById('name').value;
        const hotelLocation = document.getElementById('location').value;
        const hotelDescription = document.getElementById('description').value;
        const bookingLink = document.getElementById('link').value;

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

        
            const result = await response.json();

            if (response.ok) {
                messageDiv.textContent = result.message;
                messageDiv.style.color = 'green';
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

});
