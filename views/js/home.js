(() => {
    const updateNote = async (noteId) => {
        try {
            const response = await fetch("/updateNote", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    noteId,
                    title,
                    content,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(`Login failed: ${errorText}`);
                return;
            }

            //Parse response
            const data = await response.json();
        } catch (error) {
            alert(`Something went wrong: ${error.message}`);
        }
    };

    const deleteNoteInDB = async (noteId) => {
        try {
            const response = await fetch("/deleteNote", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    noteId: noteId,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(`Deletion failed: ${errorText}`);
                return;
            }
        } catch (error) {
            alert(`Something went wrong: ${error.message}`);
        }
    };

    const spawnNotes = async (data) => {
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
            const notesContainer = document.getElementById("cardContainer");

            for (const note of notes) {
                if (note.ownerId === data.userId) {
                    const noteCard = createNoteCard(note.title, note.content);
                    noteCard.querySelector("#edit-note").addEventListener("click", async () => {
                        await updateNote(note._id.toString());
                    });
                    noteCard.querySelector("#delete-note").addEventListener("click", async () => {
                        await deleteNoteInDB(note._id.toString());
                    });
                    notesContainer.appendChild(noteCard);
                }
            }
        } catch (error) {
            alert(`Couldn't retrieve notes: ${error.message}`);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    role: "member",
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
            <h3>Welcome back, ${data.username}!</h3>
            <p>Your role: ${data.role}</p>
            <button type="button" data-bs-toggle="modal" data-bs-target="#noteModal" class="btn btn-primary btn-sm" id="newNoteButton">New Note</button>
            <div id="notesContainer"></div>
        `;
            spawnNotes(data);
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
            <span class="coords">Location will show here if added by user</span>
        </div>
        <div class="card-footer">
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-primary" id="edit-note">
                Edit
                </button>
                <button type="button" class="btn btn-outline-danger" id="delete-note">
                Delete
                </button>
            </div>
        </div>
    `;
        card.querySelector("#delete-note").addEventListener("click", () => {
            card.remove();
        });
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
        document.getElementById("cardContainer").innerHTML = "";
    };

    const register = async (event) => {
        event.preventDefault();
        const modal = document.getElementById("signUpModal");
        const username = document.getElementById("regUsername").value;
        const password = document.getElementById("regPassword").value;
        if (!validatePassword(password)) {
            return;
        }
        try {
            const response = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                    role: "member",
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

    const createNote = async () => {
        const noteTitle = document.getElementById("noteTitle").value.trim();
        const noteContent = document.getElementById("message-text").value.trim();
        const notesContainer = document.getElementById("cardContainer");

        if (!(noteTitle || noteContent)) {
            alert("Please enter both a title and content.");
            return;
        }
        if (!noteTitle) {
            alert("Please enter a title.");
            return;
        }
        if (!noteContent) {
            alert("Please enter content.");
            return;
        }

        const newCard = createNoteCard(noteTitle, noteContent);
        notesContainer.appendChild(newCard);
        const modalElement = document.getElementById("noteModal");
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
        try {
            const response = await fetch("/addNote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: noteTitle,
                    content: noteContent,
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                alert(`Something went wrong creating the note: ${errorText}`);
                return;
            }
        } catch (error) {
            alert(`Something went wrong: ${error.message}`);
        }

        document.getElementById("noteTitle").value = "";
        document.getElementById("message-text").value = "";
    };

    const validatePassword = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        if (!(hasUppercase || hasLowercase)) {
            alert("Your password must contain at least one uppercase and lowercase letter.");
            return false;
        }
        if (!hasUppercase) {
            alert("Your password is missing an uppercase.");
            return false;
        }
        if (hasLowercase) return true;
        alert("Your password is missing a lowercase.");
        return false;
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
        document.getElementById("log-out-btn").addEventListener("click", logout);
        document.getElementById("submitNote").addEventListener("click", createNote);
    };
})();
