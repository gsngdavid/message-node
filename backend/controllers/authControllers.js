const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { name, email, password } = req.body;

  bcryptjs
    .hash(password, 12)
    .then((hashedPassword) => {
      return new User({
        name,
        email,
        password: hashedPassword,
      }).save();
    })
    .then((user) => {
      res
        .status(201)
        .json({ message: "User successfully created!", userId: user.id });
    })
    .catch((err) => {
      err.statusCode = err.statusCode ?? 500;
      next(err);
    });
};

module.exports = { signup };
