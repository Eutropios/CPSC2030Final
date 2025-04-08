const loginForm = document.querySelector("form#loginForm");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
                role: "member", // change to "admin" if needed
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert(`Login failed: ${errorText}`);
            return;
        }

        // ✅ Parse response
        const data = await response.json();

        // ✅ Store token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);

        // ✅ Show account UI, hide login/signup
        const loginDiv = document.querySelector("div#login");
        loginDiv.style.display = "none";
        document.getElementById("sign-up-btn").style.display = "none";

        const accountDiv = document.getElementById("account");
        accountDiv.style.display = "block";
        document.getElementById("log-out-btn").style.display = "block";

        accountDiv.innerHTML = `
            <h3>Welcome, ${data.username}!</h3>
            <p>Your role: ${data.role}</p>
            <button type="button" class="btn btn-primary btn-sm" id="newNoteButton">New Note</button>
            <div id="notesContainer"></div>
        `;

        // ✅ Fetch notes
        try {
            const notesResponse = await fetch("/notes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${data.token}`,
                },
            });

            if (!notesResponse.ok) {
                throw new Error("Failed to fetch notes");
            }

            const notes = await notesResponse.json();

            const notesContainer = document.getElementById("notesContainer");

            notes.forEach((note) => {
                if (note.ownerID === data.username) {
                    const noteCard = createNoteCard(note.title, note.content);
                    notesContainer.appendChild(noteCard);
                }
            });

        } catch (error) {
            alert(`Couldn't retrieve notes: ${error.message}`);
        }

    } catch (error) {
        alert(`Something went wrong: ${error.message}`);
    }
});

// ✅ Helper to create note cards
function createNoteCard(title, content) {
    const card = document.createElement("div");
    card.className = "card mb-2";

    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${content}</p>
        </div>
    `;
    return card;
}

// ✅ Logout handler
document.getElementById("log-out-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    document.getElementById("account").style.display = "none";
    document.getElementById("log-out-btn").style.display = "none";
    document.getElementById("sign-up-btn").style.display = "block";
    document.getElementById("login").style.display = "block";
});
