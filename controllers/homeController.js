const util = require("../models/util.js")
const config = require("../server/config/config.js")
const User = require("../models/user.js")
const client = util.getMongoClient()

const express = require("express")
const homeController = express.Router()

// HTTP POST
homeController.post("/register", util.logRequest, async (req, res, next) => {
    console.log("register")
    const collection = client.db().collection("Users")
    const email = req.body.email
    const password = req.body.password
    const confirm = req.body.confirm

    if (password !== confirm) {
        console.log("\t|Password does not match")
    } else {
        const user = User(email, password)
        console.info(user)
        util.insertOne(collection, user)
    }
    res.redirect("/member.html")
})

module.exports = homeController
