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
                        <p><a href="${hotel.link}" target="_blank">Click to see Images</a></p>
                        <button class="edit-hotel-btn button" data-id="${hotel.id}">Edit</button>
                        <button class="delete-hotel-btn button" data-id="${hotel.id}">Delete</button>
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

            // Add event listeners for Delete buttons
            const deleteButtons = document.querySelectorAll('.delete-hotel-btn');
            deleteButtons.forEach(button => {
                button.addEventListener('click', async (event) => {
                    const hotelId = event.target.getAttribute('data-id');
                    try {
                        const response = await fetch(`/api/delete_hotel/${hotelId}`, {
                            method: 'DELETE'
                        });

                        if (response.ok) {
                            setTimeout(() => {
                                alert('Hotel successfully deleted!');
                                window.location.reload();
                            }, 3000);
                        } else {
                            alert('Failed to delete hotel. Please try again later.');
                        }
                    } catch (error) {
                        console.error('Error deleting hotel:', error);
                        alert('An error occurred while deleting the hotel. Please try again later.');
                    }
                });
            });
        } else {
            document.getElementById('hotels-container').innerHTML = '<p>Failed to fetch hotels. Please try again later.</p>';
        }
    } catch (error) {
        document.getElementById('hotels-container').innerHTML = '<p>An error occurred while fetching hotels. Please try again later.</p>';
    }
});