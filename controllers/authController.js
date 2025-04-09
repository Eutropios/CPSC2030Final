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
    const { username, password, role } = req.body;
    const collection = client.db().collection("Users");
    const user = await util.findOne(collection, { username: username, role: role });
    if (!user) return res.status(401).send("Invalid username");
    console.log("MERGE THESE TWO ONCE DONE");
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send("Invalid password");
    req.session.user = username;
    req.session.role = role;
    const userId = user._id.toString();
    req.session.userId = userId;
    return res.status(201).json({ username: username, role: role, userId: userId });
    // res.redirect(role === "admin" ? "/admin" : "/member");
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
        const newUser = User(username, password);
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
