const express = require("express")
const feedControllers = require("../controllers/feedControllers")

const router = express.Router()

// GET /feed/posts
router.get("/posts", feedControllers.getFeeds)

// POST /feeds/post
router.post("/post", feedControllers.createPost)

module.exports = router