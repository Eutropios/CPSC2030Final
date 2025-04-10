const { default: test } = require("node:test");

(() => {
    const createNoteCard = (title, text, date) => {
        const cardColumn = document.querySelector("#cardContainer");
        const card = document.createElement("div");
        card.classList.add("card", "noteCard", "mt-2");
        card.innerHTML = `
                <div class="card-header" contenteditable="true">${title}</div>
                <div class="card-body">
                    <p contenteditable="true">
                        ${text}
                    </p>
                    <hr>
                    <span>Button for opening mapbox goes here</span>
                </div>
                <div>
                    <div class="card-footer">
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-outline-primary" id="btn-${test}" data-bs-toggle="modal" data-bs-target="${test}">Edit</button>
                            <button type="button" class="btn btn-outline-success">Share</button>
                            <button type="button" class="btn btn-outline-danger">Delete</button>
                        </div>
                        <div class="modal fade" id="${test}" tabindex="-1" role="dialog" aria-labelledby="${test}" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">EDIT</h5>
                                    </div>
                                    <div class=modal-body: id="edit-${test}">
                                        <form id="editform-${test}">
                                            <div class="form-group">
                                                <label for="update-text" class="col-form-label">New Text
                                                <textarea name="update-text" rows="8" cols="60"></textarea>
                                            </div>
                                            <hr>
                                            <div>
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</btn>
                                                <button type="submit" value="submit" class="btn btn-success">Submit</btn>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span>${date}</span>
                    </div>
                    `;

        card.querySelector(".btn-outline-danger").addEventListener("click", () => card.remove());

        cardColumn.appendChild(card);

        // We'll have to add this to the database too afterwards
        // Add listeners to note that modify database content for the note
    };
    module.exports = createNoteCard;
})();
