document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const loginDiv = document.getElementById("login");
    const accountDiv = document.getElementById("account");

    // Initially hide the account section and log out button
    accountDiv.style.display = "none";
    document.getElementById("log-out-btn").style.display = "none";

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent form submission

        // Get username input
        const username = document.getElementById("username").value;

        // Hide login form and sign up button and show account section
        loginDiv.style.display = "none";
        document.getElementById("sign-up-btn").style.display = "none";
        accountDiv.style.display = "block";
        document.getElementById("log-out-btn").style.display = "block";

        // Display user info
        accountDiv.innerHTML = `
            <h3>Welcome, ${username}!</h3>
            <p>Your account details go here.</p>
            <button type="button" class="btn btn-primary btn-sm" id="newNoteButton">New Note</button>
            <div id="notesContainer"></div>
        `;
    });

    // Use event delegation for the "New Note" button
    accountDiv.addEventListener("click", (event) => {
        if (event.target && event.target.id === "newNoteButton") {
            const noteId = `noteInput-${Date.now()}`; // Generate unique ID

            // Create a new card for note input
            const noteCard = document.createElement("div");
            noteCard.classList.add("card", "my-3");
            noteCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">New Note</h5>
                    <textarea id="${noteId}" class="form-control mb-3" placeholder="Enter your note"></textarea>
                    <button type="button" class="btn btn-primary submit-note" data-note-id="${noteId}">Submit</button>
                </div>
            `;

            // Append the card to the notes container
            document.getElementById("notesContainer").appendChild(noteCard);
        }

        // Event delegation for the submit button
        if (event.target?.classList.contains("submit-note")) {
            const noteId = event.target.getAttribute("data-note-id");
            const noteContent = document.getElementById(noteId).value;

            if (noteContent.trim() !== "") {
                // Remove the card
                event.target.closest(".card").remove();

                // Create a new note display
                const noteDisplay = createNoteCard(noteId, noteContent);

                // Determine which col to append card to
                const currentCol = (() => {
                    if (
                        document.getElementById("left-col").childElementCount -
                            document.getElementById("right-col").childElementCount ===
                        0
                    ) {
                        return "left-col";
                    }
                    return "right-col";
                })();
                // Append noteCard to correct column
                document.getElementById(currentCol).appendChild(noteDisplay);
            } else {
                alert("Please enter a note before submitting.");
            }
        }
    });

    // Create formatted noteCard
    function createNoteCard(id, content) {
        const card = document.createElement("div");
        card.classList.add("card", "noteCard", "mt-2");
        card.innerHTML = `
                    <div class="card-header" contenteditable="true">
                        ${id}
                    </div>
                    <div class="card-body" contenteditable="true">
                        ${content}
                        <hr>
                        <span class="coords">Location will show here if added by user</span>
                    </div>
                    <div class="card-footer">
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-outline-primary">Edit</button>
                            <button type="button" class="btn btn-outline-success">Share</button>
                            <button type="button" class="btn btn-outline-danger">Delete</button>
                        </div>
                    </div>
                    `;

        //card.querySelector(".btn-outline-danger").addEventListener("click", () => card.remove());
        return card;
    }

    document.getElementById("log-out-btn").addEventListener("click", () => {
        // clear username and password input fields
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";

        // hide account relevant elements and show log in and sign up elements
        loginDiv.style.display = "block";
        document.getElementById("sign-up-btn").style.display = "block";
        accountDiv.style.display = "none";
        document.getElementById("log-out-btn").style.display = "none";
    });
});
