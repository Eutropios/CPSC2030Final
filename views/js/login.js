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
            <button type="button" class="btn btn-primary btn-sm" id="newNoteButton">New Note</button>
            <div id="notesContainer"></div>
        `;
    });

    // Use event delegation for the "New Note" button
    accountDiv.addEventListener("click", function(event) {
        if (event.target && event.target.id === "newNoteButton") {
            const noteId = `noteInput-${Date.now()}`; // Generate unique ID

            // Create a new card for note input
            const noteCard = document.createElement('div');
            noteCard.classList.add('card', 'my-3');
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
        if (event.target && event.target.classList.contains("submit-note")) {
            const noteId = event.target.getAttribute("data-note-id");
            const noteContent = document.getElementById(noteId).value;

            if (noteContent.trim() !== "") {
                // Remove the card
                event.target.closest(".card").remove();

                // Create a new note display
                const noteDisplay = document.createElement('div');
                noteDisplay.classList.add('alert', 'alert-success', 'my-3');
                noteDisplay.innerText = noteContent;

                // Append the note below the New Note button
                document.getElementById("notesContainer").appendChild(noteDisplay);
            } else {
                alert("Please enter a note before submitting.");
            }
        }
    });
});
