document.getElementById('submit-btn').addEventListener('click', function () {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Check if email and password are entered
    if (!email || !password) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = 'Please fill in all fields';
        messageEl.style.color = 'red';
        return;
    }

    // Send login data to the backend
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse JSON if successful
            } else {
                throw new Error('Login failed'); // Throw error for unsuccessful responses
            }
         })
        .then(data => {
            const messageEl = document.getElementById('message');
            if (data.message) {
                messageEl.textContent = data.message;
                messageEl.style.color = response.ok ? 'green' : 'red';
            }
        })
});
