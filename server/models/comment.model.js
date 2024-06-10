const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const commentSchema = new Schema({
  post: {
    type: mongoose.Types.ObjectId,
    ref : "post",
  },
  commentor: {
    type: mongoose.Types.ObjectId,
    ref : "user"
  },
  comment: String,
  date   : {
    type   : Date,
    default: Date.now(),
  },
  reaction: {
    type   : Number,
    defaule: 0,
  },
});

const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;
