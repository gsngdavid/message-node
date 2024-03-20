const express = require("express");

const authRoutes = require("../controllers/authControllers");
const { body } = require("express-validator");
const User = require("../models/user");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("please enter a valid email")
      .custom(async (email, { req }) => {
        const user = await User.findOne({ email });
          if (user) {
              return Promise.reject("Email already exists!");
          }
      })
      .normalizeEmail(),
    body("name").isAlphanumeric().trim().isLength({ min: 3 }),
    body("password").trim().isStrongPassword(),
  ],
  authRoutes.signup
);

module.exports = router;
