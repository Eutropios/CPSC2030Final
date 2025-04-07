const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const router = express.Router();
const bcrypt = require("bcrypt");
const session = require("express-session");
const util = require("../models/util.js");
const User = require("../models/user.js");
const client = util.getMongoClient(false);

console.log("DELETE THE TEST VARIABLES AFTER MOVING TO DB");
const saltRounds = 10;
const testPassword = "bob";
const testHash = "$2b$10$dutIAZG0D4w4.oYsNxPVVe1Re7quRRY7K9aaKZkDs/vn3SII.gel.";

router.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: true,
    }),
);

// Pull this into db once passwd is complete
const usersFile = path.join(__dirname, "../models/users.json");

const getUsers = () => {
    const data = fs.readFileSync(usersFile);
    return JSON.parse(data);
};

router.get("/login", (req, res) => {
    res.sendFile("login.html", { root: path.join(__dirname, "../views") });
});

router.post("/login", async (req, res) => {
    const { username, password, role } = req.body;
    const users = getUsers();
    const user = users.find((u) => u.username === username && u.role === role);
    if (!user) return res.status(401).send("Invalid user or role");
    console.log(
        "REMEMBER TO MERGE THESE TWO WARNINGS ONCE WE'VE FINISHED DEBUGGING TO AVOID LEAKING DATA",
    );

    // Move this to registration
    bcrypt.hash(password, saltRounds, (err, hash) => {
        console.log(`Hash: ${hash}`);
        // Store hash in database here
    });

    const testMatch = await bcrypt.compare(testPassword, testHash);
    console.log(testMatch);
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send("Invalid password");

    req.session.user = { username, role };
    res.redirect(role === "admin" ? "/admin" : "/user");
});

router.post("/register", async (req, res) => {
    const collection = client.db().collection("Users");
    const user = await util.findOne({ username: req.body.username }, collection);
    if (user) {
        return res.status(400).send("User already exists. Please sign in");
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        const username = req.body.username;
        const newUser = new User({
            username: username,
            password: password,
            role: req.body.role,
        });
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
