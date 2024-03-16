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
  Post.findById(id)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }
      console.log(post)
      res.status(200).json({ post });
    })
    .catch((err) => {
      err.statusCode = err.statusCode || 500;
      next(err);
    });
};

const getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({ posts });
    })
    .catch((err) => {
      const error = new Error("Failed to fetch posts");
      error.statusCode = 500;
      next(error);
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
