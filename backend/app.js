const path = require("path");

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const feedRoutes = require("./routes/feedRoutes");

const app = express();
app.use(bodyParser.json());

app.use(morgan("tiny"));

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const { statusCode, message } = error;

  res.status(statusCode).json({ message });
});

mongoose
  .connect(process.env.DBURL)
  .then(() => {
    app.listen(4000, () => {
      console.log("Listening...");
    });
  })
  .catch((err) => console.log(err));
