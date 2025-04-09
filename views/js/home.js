(() => {
    const login = async (username, password) => {
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
            const loginDiv = document.querySelector("form#loginForm");
            loginDiv.hidden = true;
            document.getElementById("sign-up-btn").style.display = "none";

            const accountDiv = document.getElementById("account");
            accountDiv.style.display = "block";
            const logOutBtn = document.getElementById("log-out-btn");
            logOutBtn.removeAttribute("hidden");
            logOutBtn.style.display = "block";

            accountDiv.innerHTML = `
            <h3>Welcome, ${data.username}!</h3>
            <p>Your role: ${data.role}</p>
            <button type="button" data-bs-toggle="modal" data-bs-target="#noteModal" class="btn btn-primary btn-sm" id="newNoteButton">New Note</button>
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

                for (const note of notes) {
                    if (note.ownerID === data.username) {
                        const noteCard = createNoteCard(note.title, note.content);
                        notesContainer.appendChild(noteCard);
                    }
                }
            } catch (error) {
                alert(`Couldn't retrieve notes: ${error.message}`);
            }
        } catch (error) {
            alert(`Something went wrong: ${error.message}`);
        }
    };

    // ✅ Helper to create note cards
    const createNoteCard = (title, content) => {
        const card = document.createElement("div");
        card.className = "card mt-2 noteCard";

        card.innerHTML = `
        <div class="card-header">${title}</div>
        <div class="card-body">
        ${content}
        <hr />
        <span class="coords"
            >Location will show here if added by user</span
        >
        </div>
        <div class="card-footer">
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-outline-primary">
            Edit
            </button>
            <button type="button" class="btn btn-outline-success">
            Share
            </button>
            <button type="button" class="btn btn-outline-danger">
            Delete
            </button>
        </div>
        </div>
    `;

        return card;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");

        const loginForm = document.getElementById("loginForm");
        loginForm.reset();
        loginForm.hidden = false;
        document.getElementById("account").style.display = "none";
        const logOutBtn = document.getElementById("log-out-btn");
        logOutBtn.hidden = true;
        document.getElementById("sign-up-btn").style.display = "block";
        document.getElementById("login").style.display = "block";
    };

    const register = async (event) => {
        event.preventDefault();
        const modal = document.getElementById("signUpModal");
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
            if (!response.ok) {
                const errorText = await response.text();
                alert(`Registration failed: ${errorText}`);
                return;
            }

            const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
            bootstrapModal.hide();
            await login(username, password);
            document.getElementById("regUsername").value = "";
            document.getElementById("regPassword").value = "";
        } catch (error) {
            alert(`Something went wrong: ${error.message}`);
        }
    };

    window.onload = () => {
        const loginForm = document.querySelector("form#loginForm");

        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            await login(username, password);
        });

        const registerForm = document.querySelector("form#registerForm");
        registerForm.addEventListener("submit", async (event) => await register(event));
        // ✅ Logout handler
        document.getElementById("log-out-btn").addEventListener("click", logout);
    };
})();
