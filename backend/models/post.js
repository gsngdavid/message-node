const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    imageUrl: {
      type: String,
      require: true,
    },
    creator: {
        name: {
            type: String,
            require: true
        }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
