const util = require("../models/util.js");
const config = require("../server/config/config.js");
const User = require("../models/user.js");
const client = util.getMongoClient(false);

const express = require("express");
const homeController = express.Router();

// HTTP POST
homeController.post("/register", util.logRequest, async (req, res, next) => {
    console.log("register");
    const collection = client.db().collection("Users");
    const username = req.body.username;
    const password = req.body.password;

    if (password !== confirm) {
        console.log("\t|Password does not match");
    } else {
        const user = User(username, password);
        console.info(user);
        await util.insertOne(collection, user);
    }
    res.redirect("/member.html");
});

module.exports = homeController;
