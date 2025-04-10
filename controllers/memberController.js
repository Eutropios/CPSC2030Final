const util = require("../models/util.js");
const config = require("../server/config/config.js");
const Note = require("../models/note.js");
const express = require("express");
const mongodb = require("mongodb");
const client = util.getMongoClient(false);
const memberController = express.Router();

// Authentication & Authorization Middleware
const authenticateUser = (req, res, next) => {
    if (req.user == null) {
        res.status(403);
        return res.send("You need to be logged in");
    }
    next();
};

const authenticateRole = (role, req, res, next) => {
    console.log(req.user.role);
    return (req, res, next) => {
        if (req.user.role === role) {
            res.status(401);
            return res.send("Not authorized");
        }
    };
};

memberController.get("/member", authenticateUser, async (req, res, next) => {
    /*const collection = client.db().collection("Notes");
    const note = Note(req.user, "AAA is a key concept in security", "Pentester");
    await util.insertOne(collection, note);
    res.sendFile("member.html", { root: config.ROOT });*/
});

// HTTP GET
memberController.get("/notes", async (req, res, next) => {
    const collection = client.db().collection("Notes");
    const notes = await util.findAll(collection, { ownerId: req.session.userId });
    //Utils.saveJson(__dirname + '/../data/topics.json', JSON.stringify(topics))
    res.status(200).json(notes);
});

// HTTP POST
memberController.post("/addNote", async (req, res, next) => {
    const collection = client.db().collection("Notes");
    const ownerId = req.session.userId;
    const topic = req.body.title;
    const content = req.body.content;
    const note = Note(ownerId, topic, content);
    await util.insertOne(collection, note);

    res.status(200).json({ message: `You note was added to the ${topic} forum` });
    //Utils.saveJson(__dirname + '/../data/notes.json', JSON.stringify(notes))
});

// untested
memberController.put("/updateNote", async (req, res, next) => {
    const id = req.body.noteId;
    const title = req.body.title;
    const content = req.body.content;
    console.info(`Note Id ${id}`);
    const collection = client.db().collection("Notes");
    const note = await util.updateOne(collection, id, title, content);
    console.log("Note", note);
    res.status(202).json({ note: note });
});

memberController.delete("/deleteNote", async (req, res, next) => {
    const id = req.body.noteId;
    console.info(`Note Id ${id}`);
    const collection = client.db().collection("Notes");
    const note = await util.deleteOne(collection, { _id: new mongodb.ObjectId(id) });
    //const data = Utils.readJson(__dirname + '/../data/notes.json')
    //util.insertMany(notes, data[id])
    console.log("Note", note);
    res.status(202).json({ note: note });
});

module.exports = memberController;
