const path = require("path");

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const multer = require("multer");

const feedRoutes = require("./routes/feedRoutes");

const app = express();

app.use(morgan("tiny"));

app.use(bodyParser.json());

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: fileStorage, fileFilter });

  app.use(express.static(path.join(__dirname, "public")));
// app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", upload.single("image"), feedRoutes);

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
