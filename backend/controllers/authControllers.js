const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Email and password fields are required.");
    error.statusCode = 422;
    throw error;
  }

  const { email, password } = req.body;
  let loadedUser;

  return User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error("Wrong email or password");
        error.statusCode = 401;
        next(error);
      }
      loadedUser = user;
      return bcryptjs.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong email or password");
        error.statusCode = 401;
        next(error);
      }
      const token = jwt.sign(
        { email, userId: loadedUser.id },
        process.env.JWT_SECRET
      );
      res.status(200).json({ token, userId: loadedUser });
    })
    .catch((err) => {
      err.statusCode === err.statusCode ?? 500;
      next(errors);
    });
};

module.exports = { signup, login };
