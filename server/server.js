/*
 Loading built-in modules
*/
const fs = require("node:fs");
const path = require("node:path");
/*
  Loading external modules
*/
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const server = express();
/*
  Loading internal modules
*/
const config = require("./config/config.js");
const util = require("../models/util.js");
const homeController = require("../controllers/homeController.js");
const memberController = require("../controllers/memberController.js");

//----------------------------------------------------------------
// middleware
//----------------------------------------------------------------
server.use(express.static(config.ROOT));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: true,
    }),
);

// Add middleware to set req.user from session
server.use((req, res, next) => {
    if (req.session?.user) {
        req.user = req.session.user; // Assign session user to req.user
    } else {
        req.user = null;
    }
    next();
});
server.use((request, response, next) => {
    const shouldLog = !(
        request.url.startsWith("https://cdn.jsdelivr.net/") ||
        request.url.endsWith(".css") ||
        request.url.endsWith(".js") ||
        request.url.endsWith(".map") ||
        request.url.endsWith(".png") ||
        request.url.endsWith(".ico")
    );
    if (shouldLog) util.logRequest(request, response);
    next();
});

homeController.get("/", (req, res) => {
    res.sendFile("index.html");
});

server.use(homeController);
server.use(memberController);
const authController = require("../controllers/authController.js");
server.use(authController);

// catch all middleware
server.use((req, res, next) => {
    //res.status(404).sendFile('404.html',{root:config.ROOT})
    res.status(404).sendFile("404.html", { root: config.ROOT });
});

server.listen(config.PORT, "localhost", () => {
    console.log(`\t|Server listening on ${config.PORT}`);
});
