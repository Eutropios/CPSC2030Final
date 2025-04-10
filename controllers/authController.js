const express = require("express");
const path = require("node:path");
const router = express.Router();
const bcrypt = require("bcrypt");
const session = require("express-session");
const util = require("../models/util.js");
const User = require("../models/user.js");
const client = util.getMongoClient(false);

router.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: true,
    }),
);

router.get("/login", (req, res) => {
    res.sendFile("login.html", { root: path.join(__dirname, "../views") });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const collection = client.db().collection("Users");
    const user = await util.findOne(collection, { username: username });
    if (!user) return res.status(401).send("Invalid username or password");
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send("Invalid username or password");

    req.session.user = username;
    const role = user.role;
    req.session.role = role;
    const userId = user._id.toString();
    req.session.userId = userId;
    console.log(role);
    if (role === "admin") res.redirect("/admin");
    return res.status(201).json({ username: username, role: role, userId: userId });
});

router.post("/register", async (req, res) => {
    const collection = client.db().collection("Users");
    const user = await util.findOne(collection, { username: req.body.username });
    if (user) {
        return res.status(400).send("User already exists. Please sign in");
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        const username = req.body.username;
        const newUser = User(username, password, "admin");
        await util.insertOne(collection, newUser);
        return res.status(201).json(newUser);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

// GET logout
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;
