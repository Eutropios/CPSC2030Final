/*
 Loading built-in modules
*/
const fs = require("node:fs")
const path = require("node:path")
/*
  Loading external modules
*/
const express = require("express")
const server = express()
require("dotenv").config()
console.log(process.env) // remove this after you've confirmed it is working
/*
  Loading internal modules
*/
const config = require("./config/config.js")
const util = require("../models/util.js")
const homeController = require("../controllers/homeController.js")
const memberController = require("../controllers/memberController.js")

//----------------------------------------------------------------
// middleware
//----------------------------------------------------------------
server.use(express.static(config.ROOT))
server.use(express.json())
server.use(express.urlencoded({ extended: false }))
server.use((request, response, next) => {
    util.logRequest(request, response)
    next()
})
homeController.get("/", (req, res) => {
    res.sendFile("index.html")
})
server.use(homeController)
server.use(memberController)

// catch all middleware
server.use((req, res, next) => {
    //res.status(404).sendFile('404.html',{root:config.ROOT})
    res.status(404).sendFile("404.html", { root: config.ROOT })
})
server.listen(config.PORT, "localhost", () => {
    console.log(`\t|Server listening on ${config.PORT}`)
})
