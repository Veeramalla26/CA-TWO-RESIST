document.addEventListener('DOMContentLoaded', function() {  
    const editHotelForm = document.getElementById('edit-hotel-form');
    if (editHotelForm) {
        editHotelForm.addEventListener('submit', async function(event) {
            event.preventDefault(); 
            const hotelId = document.getElementById('hotel-id').value;
            const hotelName = document.getElementById('name').value;
            const hotelLocation = document.getElementById('location').value;
            const hotelDescription = document.getElementById('description').value;
            const bookingLink = document.getElementById('link').value;

            console.log('Form Data:', {
                hotelId,
                hotelName,
                hotelLocation,
                hotelDescription,
                bookingLink
            });

            try {
                
                const response = await fetch(`/api/update_hotel/${hotelId}`, {
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
                console.log('Server Response:', result);

               
                if (response.ok) {
                    setTimeout(() => {
                        alert(result.message);
                        window.location.href = '/view_hotels';
                    }, 3000);
                } else {
                    alert(`Failed to update hotel: ${result.message}`);
                }
            } catch (error) {
                console.error('Error updating hotel:', error);
                alert('An error occurred while updating the hotel. Please try again later.');
            }
        });
    }
});
