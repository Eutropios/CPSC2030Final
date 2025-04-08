const loginForm = document.querySelector("form#loginForm");
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent traditional form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log(username, password);

    try {
        const response = await fetch("/login", {
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

        if (!response.ok) {
            const errorText = await response.text();
            alert(`Login failed: ${errorText}`);
            return;
        }

        // THIS CONTENT SHOULD BE RETURNED ON SUCCESSFUL LOGIN

        // Success - show account area
        const loginDiv = document.querySelector("div#login");
        loginDiv.style.display = "none";
        document.getElementById("sign-up-btn").style.display = "none";
        /*accountDiv.style.display = "block";
        document.getElementById("log-out-btn").style.display = "block";

        accountDiv.innerHTML = `
            <h3>Welcome, ${username}!</h3>
            <p>Your account details go here.</p>
            <button type="button" class="btn btn-primary btn-sm" id="newNoteButton">New Note</button>
            <div id="notesContainer"></div>
        `;
        // Attempting to pull Notes database from server
        try {
            const userNotes = await fetch("/notes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }, // memberController.get("/notes") needs to be tested, may not work
            });
            for (note in userNotes) {
                if (note.ownerID === username) {
                    createNoteCard(note.title, note.content, note.dateCreated);
                }
            }
        } catch (error) {
            alert(`Couldn't retrieve ${username}'s notes: ${error.message}`);
        }*/
    } catch (error) {
        alert(`Something went wrong: ${error.message}`);
    }
});
