const util = require("../models/util.js")
const config = require("../server/config/config.js")
const Post = require("../models/post.js")
const client = util.getMongoClient(false)
const express = require("express")
const memberController = express.Router()
// Authentication & Authorization Middleware
const authenticateUser = (req, res, next) => {
    if (req.user == null) {
        res.status(403)
        return res.send("You need to be logged in")
    }
    console.log(req.user)
    next()
}
const authenticateRole = (role, req, res, next) => {
    return (req, res, next) => {
        if (req.user.role === role) {
            res.status(401)
            return res.send("Not authorized")
        }
    }
}
memberController.get("/member", authenticateUser, async (req, res, next) => {
    console.info("Inside member.html")
    const collection = client.db().collection("Posts")
    const post = Post("Security", "AAA is a key concept in security", "Pentester")
    util.insertOne(collection, post)
    res.sendFile("member.html", { root: config.ROOT })
})
// HTTP GET
memberController.get("/posts", async (req, res, next) => {
    const collection = client.db().collection("Posts")
    const posts = await util.findAll(collection, {})
    //Utils.saveJson(__dirname + '/../data/topics.json', JSON.stringify(topics))
    res.status(200).json(posts)
})
memberController.get("/post/:ID", async (request, response, next) => {
    // extract the querystring from url
    const id = request.params.ID
    console.info(`Post Id ${id}`)
    const collection = client.db().collection("Posts")
    const post = await util.findOne(collection, id)
    //const data = Utils.readJson(__dirname + '/../data/posts.json')
    //util.insertMany(posts, data[id])
    console.log("Post", post)
    response.status(200).json({ post: post })
})
memberController.get("/postMessage", async (req, res, next) => {
    res.sendFile("postMessage.html", { root: config.ROOT })
})
// HTTP POST
memberController.post("/addPost", async (req, res, next) => {
    const collection = client.db().collection("Posts")
    const topic = req.body.topic
    const message = req.body.message
    const user = req.body.postedBy
    const post = Post(topic, message, user)
    util.insertOne(collection, post)

    // res.json(
    //     {
    //         message: `You post was added to the ${topic} forum`
    //     }
    // )
    //Utils.saveJson(__dirname + '/../data/posts.json', JSON.stringify(posts))
    res.redirect("/posts.html")
})

module.exports = memberController
