const Post = require("../models/post");
const { validationResult } = require("express-validator");

const getPosts = (req, res, next) => {
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

module.exports = { getPosts, createPost };
