document.addEventListener('DOMContentLoaded', function() {
    const addHotelForm = document.getElementById('add-hotel-form');
    const messageDiv = document.getElementById('message');

    
    addHotelForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const hotelName = document.getElementById('name').value;
        const hotelLocation = document.getElementById('location').value;
        const hotelDescription = document.getElementById('description').value;
        const bookingLink = document.getElementById('link').value;

        
    });

});
