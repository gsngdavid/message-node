const express = require("express");

const authRoutes = require("../controllers/authControllers");

const router = express.Router();

router.post("/login", authRoutes.createUser);

module.exports = router;
