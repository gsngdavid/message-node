const express = require("express");
const { body } = require("express-validator");

const feedControllers = require("../controllers/feedControllers");

const router = express.Router();

// GET /feed/posts
router.get("/posts", feedControllers.getPosts);

// POST /feeds/post
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedControllers.createPost
);

module.exports = router;
