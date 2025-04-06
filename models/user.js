const User = (username, hashed) => {
    const Role = {
        ADMIN: "admin",
        MEMBER: "member",
        GUEST: "guest",
    };
    return {
        username: username, // Plaintext
        password: hashed, // Salted and hashed
        role: Role.MEMBER, // note sure what this is for
        since: new Date().toUTCString(), // registration date
    };
};
module.exports = User;
