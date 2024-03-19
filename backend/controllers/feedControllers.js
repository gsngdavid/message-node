const path = require("path");

const Post = require("../models/post");
const { validationResult } = require("express-validator");
const { removeFile } = require("../utils/helpers");

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

  if (!req.file) {
    const error = new Error("No file provide");
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = "images/" + req.file.filename;
  const { title, content } = req.body;

  const post = new Post({
    title,
    content,
    imageUrl,
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

const updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }
  const postId = req.params.id;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = "images/" + req.file.filename;
  }

  if (imageUrl === "undefined") {
    const error = new Error("No file provide");
    error.statusCode = 422;
    throw error;
  }

  const { title, content } = req.body;
  
  Post.findByIdAndUpdate(postId, { title, content, imageUrl })
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find a post");
        error.statusCode = 404;
        next(error);
      }

      if (imageUrl !== post.imageUrl) {
        removeFile(path.join(__dirname, "..", "public", imageUrl));
      }

      res.status(200).json({ post });
    })
    .catch((err) => {
      const error = new Error("Something went wrong");
      error.statusCode = err.status || 500;

      next(error);
    });
};

module.exports = { getPost, getPosts, createPost, updatePost };
