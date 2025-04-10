(() => {
    const createNoteCard = (title, text, date) => {
        const cardColumn = document.querySelector("#cardContainer");
        const card = document.createElement("div");
        card.classList.add("card", "noteCard", "mt-2");
        card.innerHTML = `
                    <div class="card-header" contenteditable="true">
                        ${title}
                    </div>
                    <div class="card-body">
                       <p contenteditable="true">
                        ${text}
                       </p>
                       <hr>
                        <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#${date.replace(" ", "-")}">
                            Sign Up
                        </button>
                        <div
                        class="modal fade"
                        id="${date.replace(" ", "-")}"
                        tabindex="-1"
                        role="dialog"
                        aria-labelledby="${date.replace(" ", "-")}"
                        aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content">
                                <div>Mapbox API content will go here, API call will be sent server-side and sent back here</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div>
                    <div class="card-footer">
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-outline-primary">Edit</button>
                            <button type="button" class="btn btn-outline-success">Share</button>
                            <button type="button" class="btn btn-outline-danger">Delete</button>
                        </div>
                        <span>${date}</span>
                    </div>
                    `;

        card.querySelector(".btn-outline-danger").addEventListener("click", () => card.remove());
        cardColumn.appendChild(card);
    };
    module.exports = createNoteCard;
})();
