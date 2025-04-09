const util = require("../models/util.js");
const config = require("../server/config/config.js");
const Note = require("../models/note.js");
const express = require("express");
const client = util.getMongoClient(false);
const memberController = express.Router();

// Authentication & Authorization Middleware
const authenticateUser = (req, res, next) => {
    console.log(`User: ${req.user}`);
    if (req.user == null) {
        res.status(403);
        return res.send("You need to be logged in");
    }
    next();
};

const authenticateRole = (role, req, res, next) => {
    return (req, res, next) => {
        if (req.user.role === role) {
            res.status(401);
            return res.send("Not authorized");
        }
    };
};

memberController.get("/member", authenticateUser, async (req, res, next) => {
    const collection = client.db().collection("Notes");
    const note = Note(req.user, "AAA is a key concept in security", "Pentester");
    await util.insertOne(collection, note);
    res.sendFile("member.html", { root: config.ROOT });
});

// HTTP GET
memberController.get("/notes", async (req, res, next) => {
    const collection = client.db().collection("Notes");
    const notes = await util.findAll(collection, {});
    //Utils.saveJson(__dirname + '/../data/topics.json', JSON.stringify(topics))
    res.status(200).json(notes);
});

memberController.get("/note/:ID", async (request, response, next) => {
    // extract the querystring from url
    const id = request.params.ID;
    console.info(`Note Id ${id}`);
    const collection = client.db().collection("Notes");
    const note = await util.findOneId(collection, id);
    //const data = Utils.readJson(__dirname + '/../data/notes.json')
    //util.insertMany(notes, data[id])
    console.log("Note", note);
    response.status(200).json({ note: note });
});

memberController.get("/postMessage", async (req, res, next) => {
    await res.sendFile("postMessage.html", { root: config.ROOT });
});

// HTTP POST
memberController.post("/addNote", async (req, res, next) => {
    const collection = client.db().collection("Notes");
    const topic = req.body.topic;
    const message = req.body.message;
    const user = req.body.postedBy;
    const note = Note(topic, message, user);
    await util.insertOne(collection, note);

    // res.json(
    //     {
    //         message: `You note was added to the ${topic} forum`
    //     }
    // )
    //Utils.saveJson(__dirname + '/../data/notes.json', JSON.stringify(notes))
    res.redirect("/notes.html");
});

// untested
memberController.post("/updateNote", async (req, res, next) => {
    const collection = client.db().collection("Notes");
    const id = req.body.note._id
    const update = req.body.edit;
    const user = req.body.postedBy;
    await util.updateOne(collection, id, update);
});

module.exports = memberController;
