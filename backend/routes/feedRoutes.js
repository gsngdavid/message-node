const express = require("express");
const { body, param, query } = require("express-validator");

const feedControllers = require("../controllers/feedControllers");

const router = express.Router();

// GET /feed/posts
router.get("/posts", query("page").isNumeric(), feedControllers.getPosts);

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

router.delete(
  "/post/:id",
  [param("id").isMongoId()],
  feedControllers.deletePost
);

module.exports = router;
