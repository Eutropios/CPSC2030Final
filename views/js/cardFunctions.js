;(() => {
    document.addEventListener("DOMContentLoaded", () => {
        const newNote = document.querySelector("#addNote")

        function createNoteCard() {
            const cardColumn = document.querySelector("#cardContainer")
            const card = document.createElement("div")
            card.classList.add("card", "noteCard", "mt-2")
            card.innerHTML = `
                        <div class="card-header" contenteditable="true">
                            Header Name Here
                        </div>
                        <div class="card-body">
                           <p contenteditable="true"> 
                            Body paragraph here
                           </p>
                           <hr>
                            <span class="text-center coords">Location will show here if added by user</span>
                        </div>
                        </div>
                        <div>
                        <div class="card-footer">
                            <div class="btn-group" role="group">
                                <button type="button" class="btn btn-outline-primary">Edit</button>
                                <button type="button" class="btn btn-outline-success">Share</button>
                                <button type="button" class="btn btn-outline-danger">Delete</button>
                            </div>
                        </div>
                        `

            card.querySelector(".btn-outline-danger").addEventListener("click", () => card.remove())

            cardColumn.appendChild(card)
        }

        newNote.addEventListener("click", createNoteCard)
    })
})()
