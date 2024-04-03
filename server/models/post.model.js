const { Schema, default: mongoose, Mongoose } = require("mongoose");
const comment = require("./comment.model");
const postschema = new Schema({
  uploader: {
    type: mongoose.Types.ObjectId,
    ref: "users",
  },
  time: {
    type: Date,
    default: Date.now(),
  },
  description: String,
  media: String,
  reaction: {
    type: Number,
    default: 0,
  },
  comments: [{
    type: mongoose.Types.ObjectId,
  }
  ref: "comments",
  ],
});

const Post = mongoose.model("post", postschema);

module.exports = Post;
