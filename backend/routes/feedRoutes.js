const express = require("express");
const { body, param } = require("express-validator");

const feedControllers = require("../controllers/feedControllers");

const router = express.Router();

// GET /feed/posts
router.get("/posts", feedControllers.getPosts);

// GET /feed/post/:id
router.get("/post/:id", param("id").isMongoId(), feedControllers.getPost);

// POST /feeds/post
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedControllers.createPost
);

router.put(
  "/post/:id",
  [
    param("id").isMongoId(),
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedControllers.updatePost
);

module.exports = router;
