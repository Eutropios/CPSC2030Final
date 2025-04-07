const registerForm = document.querySelector("form#registerForm");
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent traditional form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log(username, password);

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
                role: "user", // or "admin" if logging in as admin
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert(`Registration failed: ${errorText}`);
            return;
        }
    } catch (error) {
        alert(`Something went wrong: ${error.message}`);
    }
});
