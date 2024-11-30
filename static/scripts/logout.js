document.getElementById('logout-btn').addEventListener('click', function () {
    
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        } else {
            throw new Error('Logout failed'); 
        }
    })
    .then(data => {
        const messageEl = document.getElementById('message');


    
        if (data.redirect_url) {
            window.location.href = data.redirect_url;  // Redirect to the URL
        } else {
            messageEl.style.color = 'green'; // Success message color
        }
    })
    .catch(error => {
        const messageEl = document.getElementById('message');
        messageEl.textContent = 'An error occurred during logout. Please try again.';
        messageEl.style.color = 'red';
    });
});
