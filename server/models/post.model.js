const { Schema, default: mongoose, Mongoose } = require("mongoose");
const comment = require("./comment.model");
const Reaction = require("./reaction.model");
const postschema = new Schema({
    uploader: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    time: {
        type: Date,
        default: Date.now(),
    },
    description: String,
    media: String,
    reactions: [
        {
            type: mongoose.Types.ObjectId,
            ref: "reaction",
        },
    ],
    likes: {
        type: Number,
        default: 0,
        min: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
        min: 0,
    },
    comments: [
        {
            type: mongoose.Types.ObjectId,
            ref: "comment",
        },
    ],
});

const Post = mongoose.model("post", postschema);

module.exports = Post;
