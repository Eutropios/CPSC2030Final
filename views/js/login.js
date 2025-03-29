document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const loginDiv = document.getElementById("login");
    const accountDiv = document.getElementById("account");
    
    // Initially hide the account section
    accountDiv.style.display = "none";

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission
        
        // Get username input
        const username = document.getElementById("username").value;

        // Hide login form and show account section
        loginDiv.style.display = "none";
        accountDiv.style.display = "block";

        // Display user info
        accountDiv.innerHTML = `
            <h3>Welcome, ${username}!</h3>
            <p>Your account details go here.</p>
            <button type="button" class="btn btn-primary btn-sm">New Note</button>
        `;
    });
});
