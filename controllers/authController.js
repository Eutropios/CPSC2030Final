const express = require("express");
const path = require("node:path");
const router = express.Router();
const bcrypt = require("bcrypt");
const session = require("express-session");
const util = require("../models/util.js");
const User = require("../models/user.js");
const client = util.getMongoClient(false);

// Session middleware
router.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: true,
    }),
);

// GET: Login page
// router.get("/login", (req, res) => {
//     res.sendFile("login.html", { root: path.join(__dirname, "../views") });
// });
// GET: Login page
router.get("/login", (req, res) => {
    res.sendFile("index.html", { root: path.join(__dirname, "../views") });
});

// POST: Login form submission
router.post("/login", async (req, res) => {
    const { username, password, role } = req.body;
    const collection = client.db().collection("Users");

    try {
        const user = await util.findOne(collection, { username: username, role: role });

        if (!user) {
            return res.redirect("/login?error=invalid_username_or_password");
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.redirect("/login?error=invalid_username_or_password");
        }

        // Set session variables
        req.session.user = username;
        req.session.role = role;
        const userId = user._id.toString();
        req.session.userId = userId;

        // Return user info (can change to redirect if needed)
        return res.status(201).json({ username: username, role: role, userId: userId });

        // OR if you prefer redirection after login:
        // return res.redirect(role === "admin" ? "/admin" : "/member");

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).send("Internal Server Error");
    }
});

// POST: Register a new user
router.post("/register", async (req, res) => {
    const collection = client.db().collection("Users");

    try {
        const existingUser = await util.findOne(collection, { username: req.body.username });

        if (existingUser) {
            return res.status(400).send("User already exists. Please sign in");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = User(req.body.username, hashedPassword);

        await util.insertOne(collection, newUser);

        return res.status(201).json(newUser);

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

// GET: Logout
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;
