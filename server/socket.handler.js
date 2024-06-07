const User = require("./models/users.model");
const Post = require("./models/post.model");
const Comment = require("./models/comment.model");
const Reaction = require("./models/reaction.model");
const friend_is_unique = require("./middlewares/friends_validator");
async function socketfunc(socket) {
    socket.on("sendall", () => {
        User.find()
            .select("-friends")
            .exec()
            .then((data) => {
                socket.emit("users", data);
            });
    });

    socket.on("login", async (uname) => {
        console.log("trying to login", uname);
        const id = await User.findOne({ name: uname }).select("_id").exec();
        if (id) socket.emit("logged_in", id);
        else socket.emit("wrong_cred");
    });

    socket.on("register", (uname) => {
        console.log("tch tch");
        let user = new User({
            name: uname,
        });
        user.save().then((data) => {
            user.friends.push(data._id);
            user.save().then((data) => {
                socket.emit("registered", data._id);
            });
        });
    });

    socket.on("initial_req", async (id) => {
        let friendlist = await User.findOne({ _id: id }).select("friends").exec();
        let posts = await Post.find({ uploader: { $in: friendlist.friends } })
            .populate("uploader")
            .populate({ path: "comments", populate: { path: "commentor" } })
            .populate({ path: "reactions", match: { reactor: id } })
            .exec();

        socket.emit("initial_post", posts);
    });

    socket.on("post", async (user_id, description, image) => {
        console.log(user_id, description, image);
        let post = new Post({
            uploader: user_id,
            description: description,
            media: Buffer.from(image).toString("base64"),
        });
        // console.log(user.posts);
        post.save();
    });
    socket.on("liked", (uid, post_id, reactionid, setReactionDetails) => {
        if (reactionid) {
            Reaction.findById(reactionid, (err, document) => {
                if (document.reaction == -1) {
                    document.reaction = 1;
                    document.save().then((err, document) => {
                        Post.findByIdAndUpdate(post_id, { $inc: { likes: 1, dislikes: -1 } });
                        setReactionDetails(document);
                    });
                }
            }).exec();

            // Reaction.findByIdAndUpdate(reactionid, { reaction: 1 }).exec()
        } else {
            const reaction = new Reaction({
                reaction: 1,
                parent: String(post_id),
                reactor: uid,
            });
            reaction.save().then((data) => {
                console.log(uid + " " + post_id + " " + reactionid);
                Post.findByIdAndUpdate(post_id, {
                    $push: { reactions: data._id },
                    $inc: { likes: 1 },
                }).exec();
                setReactionDetails(data);
            });
        }
    });
    socket.on("disliked", (uid, post_id, reactionid, setReactionDetails) => {
        if (reactionid) {
            console.log(reactionid);
            Reaction.findById(reactionid)
                .exec()
                .then((document) => {
                    if (document.reaction == 1) {
                        document.reaction = -1;
                        Post.findByIdAndUpdate(post_id, {
                            $inc: { dislikes: 1, likes: -1 },
                        }).exec();
                        setReactionDetails(document);
                    }
                });
            
        } else {
            const reaction = new Reaction({
                reaction: -1,
                parent: String(post_id),
                reactor: uid,
            });
            reaction.save().then((data) => {
                Post.findByIdAndUpdate(post_id, {
                    $push: { reactions: data._id },
                    $inc: { dislikes: 1 },
                });
            });
        }
    });
    socket.on("unreacted", (uid, post_id, reactionid) => {
        console.log(reactionid);
        Reaction.findByIdAndDelete(reactionid)
            .exec()
            .then((data) => {
                console.log(data.reaction);
            });
        Post.findOneAndUpdate(
            { _id: post_id, likes: { $gt: 0 } },
            {
                $pull: {
                    reactions: reactionid,
                },
                $inc: { likes: -1 },
            }
        ).exec();
    });

    // ! almost unwanted code should remove later
    socket.on("ready", async (name) => {
        data = await User.find().select("name").exec();
        friends = await User.findOne({ name: name }).select("friends").populate("friends").exec();
        uid = await User.findOne({ name: name }).select("_id").exec();
        socket.emit("uid", uid);
        socket.emit("friends", friends);
        socket.emit("users", data);
    });

    socket.on("friend_list", async (uid) => {
        data = await User.findOne({ _id: uid }).select("friends").populate("friends").exec();
        data.friends ? socket.emit("friends", data.friends) : socket.emit("no_friends");
    });

    socket.on("add_friend", async (uid, friendid) => {
        if ((await friend_is_unique(uid, friendid)) == 1) {
            User.findById(uid)
                .exec()
                .then((data) => {
                    data.friends.push(friendid);
                    data.save();
                });
            User.findById(friendid)
                .exec()
                .then((data) => {
                    data.friends.push(uid);
                    data.save();
                });
        } else {
            socket.emit("exist");
        }
        console.log("friend:", friendid);
    });

    socket.on("comment", (post_, commentor, comment) => {
        comment = new Comment({
            post: post_,
            comment: comment,
            commentor: commentor,
        });
        comment.save().then((cmt) => {
            Post.findByIdAndUpdate(post_, { $push: { comments: String(cmt._id) } }).exec();
            console.log(String(cmt._id));
        });
    });
}

module.exports = socketfunc;
