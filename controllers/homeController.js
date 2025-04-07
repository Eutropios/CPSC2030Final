const util = require("../models/util.js");
const config = require("../server/config/config.js");
const User = require("../models/user.js");
const client = util.getMongoClient(false);

const express = require("express");
const homeController = express.Router();

module.exports = homeController;
