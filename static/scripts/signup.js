document.getElementById('submit-btn').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;


    if (!email || !password || !confirmPassword) {
        document.getElementById('message').textContent = 'All fields are required.';
        document.getElementById('message').style.color = 'red';
        return;
    }

    if (password !== confirmPassword) {
        document.getElementById('message').textContent = 'Passwords do not match.';
        document.getElementById('message').style.color = 'red';
        return;
    }
    
    // Send data to backend
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, confirm_password: confirmPassword }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').textContent = data.message || 'Sign-up successful!';
        document.getElementById('message').style.color = 'green';
    })
    .catch(error => {
        document.getElementById('message').textContent = 'Error: ' + error.message;
        document.getElementById('message').style.color = 'red';
    });

});
