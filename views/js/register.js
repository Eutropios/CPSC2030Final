document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("form#registerForm");
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent traditional form submission

        const username = document.getElementById("regUsername").value;
        const password = document.getElementById("regPassword").value;

        try {
            const response = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                    role: "member", // or "admin" if logging in as admin
                }),
            });
            console.log("Hi");
            if (!response.ok) {
                const errorText = await response.text();
                alert(`Registration failed: ${errorText}`);
                return;
            }
        } catch (error) {
            alert(`Something went wrong: ${error.message}`);
        }
    });
});
