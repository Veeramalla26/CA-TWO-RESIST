document.getElementById('submit-btn').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

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
});
