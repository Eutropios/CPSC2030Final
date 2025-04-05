const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const bcrypt = require('bcrypt');
const session = require('express-session');


router.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
}));

const usersFile = path.join(__dirname, '../data/users.json');

function getUsers(){
    const data = fs.readFileSync(usersFile);
    return JSON.parse(data);
}

router.get('/login', (req, res) => {
    res.sendFile("login.html", { root: path.join(__dirname, '../views') });
});

router.post("/login", async (req, res) => {
    const { username, password, role } = req.body
    const users = getUsers()
    
    const user = users.find(u => u.username === username && u.role === role)
    if (!user) return res.status(401).send("Invalid user or role")

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).send("Invalid password")

    req.session.user = { username, role }
    res.redirect(role === "admin" ? "/admin" : "/user")
})

// GET logout
router.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/login")
})

module.exports = router
