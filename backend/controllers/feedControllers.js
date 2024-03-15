const post = require("../models/post");
const Post = require("../models/post");
const { validationResult } = require("express-validator");

const getPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Invalid params");
    error.statusCode = 422;
    throw error;
  }

  const { id } = req.params;
  post
    .findById(id)
    .then((post) => {
      if (!post) {
        res.status(404).json({ message: "No post found" });
      }
      res.status(200).json({ post });
    })
    .catch((err) => {
      const error = new Error("Fetching post failed!");
      error.statusCode = 500;
      next(err);
    });
};

const getPosts = (req, res, next) => {
  console.log("====================")
  res.json({
    posts: [
      {
        _id: "1",
        title: "My feed",
        content: "This is a feed",
        creator: { name: "David" },
        createdAt: new Date(),
        imageUrl: "/images/duck.jpg",
      },
    ],
    totalItems: 1,
  });
};

const createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, incorrect data entered!");
    error.statusCode = 422;

    throw error;
  }

  const { title, content } = req.body;

  const post = new Post({
    title,
    content,
    imageUrl: "/images/chess.jpg",
    creator: { name: "David" },
  });

  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post successfully created!",
        post: result,
      });
    })
    .catch((err) => {
      const error = new Error("Something went wrong");
      error.statusCode = err.status || 500;

      next(error);
    });
};

module.exports = { getPost, getPosts, createPost };
