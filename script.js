document.getElementById('loginForm').addEventListener('submit', function(event) {
    var form = event.target;
    if (form.checkValidity()) {
        // Redirect to another page if the form is valid
        event.preventDefault(); // Prevent the default form submission behavior
        window.location.href = 'second.html';
    }
});