const Note = (ownerId, title, content) => {
    return {
        ownerId: ownerId,
        title: title,
        dateCreated: new Date().toUTCString(),
        dateModified: new Date().toUTCString(),
        content: content,
    };
};
module.exports = Note;
