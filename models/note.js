(() => {
    const Note = (topic, message, by) => {
        return {
            Topic: topic,
            Message: message,
            By: by,
            At: new Date().toUTCString(),
        };
    };
    module.exports = Note;
})();
