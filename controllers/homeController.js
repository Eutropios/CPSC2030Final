const util = require("../models/util.js");
const config = require("../server/config/config");
const User = require("../models/user");
const client = util.getMongoClient();

const express = require("express");
const homeController = express.Router();

// HTTP POST
homeController.post("/register", util.logRequest, async (req, res, next) => {
    console.log("register");
    let collection = client.db().collection("Users");
    let email = req.body.email;
    let password = req.body.password;
    let confirm = req.body.confirm;

    if (password !== confirm) {
        console.log("\t|Password does not match");
    } else {
        let user = User(email, password);
        console.info(user);
        util.insertOne(collection, user);
    }
    res.redirect("/member.html");
});

module.exports = homeController;
