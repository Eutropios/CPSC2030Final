(() => {

    document.addEventListener("DOMContentLoaded", function () {
        const newNote = document.querySelector(".btn-primary.btn-sm");
      
        function createNoteCard() {
            const cardColumn = document.querySelector(".col-9");
            const card = document.createElement("div");
            card.classList.add("card", "mt-3");
            card.innerHTML = `
                <div class="card-header" contenteditable="true">New Note Title</div>
                <div class="card-body" contenteditable="true">Edit note paragraph...</div>
                <div class="card-footer">
                    <div class="btn-group" role="group">
                        <button class="btn btn-outline-primary">Edit</button>
                        <button class="btn btn-outline-success">Share</button>
                        <button class="btn btn-outline-danger">Delete</button>
                    </div>
                </div>
            `;

            card.querySelector(".btn-outline-danger").addEventListener("click", () => card.remove());

            cardColumn.appendChild(card);
        }

        newNote.addEventListener("click", createNoteCard);
    });
})();
