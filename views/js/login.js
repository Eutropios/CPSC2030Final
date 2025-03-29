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

    // Use event delegation to listen for the "New Note" button click
    accountDiv.addEventListener("click", function(event) {
        if (event.target && event.target.classList.contains("btn-primary")) {
            if (event.target.innerText === "New Note") {
                // Create a new card for note input
                const noteCard = document.createElement('div');
                noteCard.classList.add('card', 'my-3');
                noteCard.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">New Note</h5>
                        <textarea id="noteInput" class="form-control mb-3" placeholder="Enter your note"></textarea>
                        <button type="button" class="btn btn-primary" id="submitNote">Submit</button>
                    </div>
                `;

                // Append the card to the account section
                accountDiv.appendChild(noteCard);

                // Add event listener for submitting the note
                const submitNoteButton = document.getElementById("submitNote");
                submitNoteButton.addEventListener("click", function() {
                    const noteContent = document.getElementById("noteInput").value;

                    if (noteContent.trim() !== "") {
                        // Hide the card
                        noteCard.style.display = "none";

                        // Create a new note display
                        const noteDisplay = document.createElement('div');
                        noteDisplay.classList.add('alert', 'alert-success', 'my-3');
                        noteDisplay.innerText = noteContent;

                        // Append the note below the New Note button
                        accountDiv.insertBefore(noteDisplay, event.target);
                    } else {
                        alert("Please enter a note before submitting.");
                    }
                });
            }
        }
    });
});
