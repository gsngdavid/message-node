const express = require("express")
const feedControllers = require("../controllers/feedControllers")

const router = express.Router()

// GET /feed/posts
router.get("/posts", feedControllers.getPosts)

// POST /feeds/post
router.post("/post", feedControllers.createPost)

module.exports = router