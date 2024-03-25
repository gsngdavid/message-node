const path = require("path");

const Post = require("../models/post");
const { validationResult } = require("express-validator");
const { removeFile } = require("../utils/helpers");
const User = require("../models/user");

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
      console.log(post);
      res.status(200).json({ post });
    })
    .catch((err) => {
      err.statusCode = err.statusCode || 500;
      next(err);
    });
};

const getPosts = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("page should be a number");
    error.statusCode = 422;
    throw error;
  }

  const { page } = req.query || 1;
  const postsPerPage = 3;
  let totalItems;

  Post.countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .populate("creator")
        .skip((page - 1) * postsPerPage)
        .limit(postsPerPage);
    })
    .then((posts) => {
      res.status(200).json({ posts, totalItems });
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
    creator: req.userId,
  });

  post
    .save()
    .then((post) => {
      return User.findByIdAndUpdate(
        post.creator,
        {
          $push: { posts: post.id },
        },
        { new: true }
      );
    })
    .then((user) => {
      res.status(201).json({
        message: "Post successfully created!",
        post,
        creator: { _id: user.id, name: user.name },
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
  const { userId } = req;

  Post.findOneAndUpdate(
    { _id: postId, creator: userId },
    { title, content, imageUrl }
  )
    .then((post) => {
      if (!post) {
        const error = new Error(
          "Could not find a post or you're not the creator"
        );
        error.statusCode = 403;
        return next(error);
      }

      if (imageUrl !== post.imageUrl) {
        removeFile(path.join(__dirname, "..", "public", post.imageUrl));
      }

      res.status(200).json({ post });
    })
    .catch((err) => {
      const error = new Error("Something went wrong");
      error.statusCode = err.status || 500;

      next(error);
    });
};

const deletePost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }

  const { id } = req.params;
  const { userId } = req;

  Post.findOneAndDelete({ $and: [{ _id: id }, { creator: userId }] })
    .then(async (post) => {
      if (!post) {
        const error = new Error(
          "Could not find post or you're not the creator!"
        );
        error.statusCode = 403;
        return next(error);
      }

      await User.findByIdAndUpdate(userId, { $pull: { posts: id } });

      removeFile(path.join(__dirname, "..", "public", post.imageUrl));
      res.status(200).json({ message: "Post deleted successfully", post });
    })
    .catch((err) => {
      err.statusCode = err.statusCode ?? 500;
      next(err);
    });
};

module.exports = { getPost, getPosts, createPost, updatePost, deletePost };
