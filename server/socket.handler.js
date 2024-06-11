const User             = require("./models/users.model");
const Post             = require("./models/post.model");
const Comment          = require("./models/comment.model");
const Reaction         = require("./models/reaction.model");
const friend_is_unique = require("./middlewares/friends_validator");
const mongoose         = require("mongoose");
let   onlineUsers      = {};
async function socketfunc(socket) {
    socket.on("sendall", () => {
        User.find()
            .select("-friends")
            .exec()
            .then((data) => {
                socket.emit("users", data);
            });
    });
      // ! I am trying to make friend requests and adding friends synchronize with both users
      // ! for that using same method as the messaging app storing all the users id with thheir socket id
      // ! in a object then emitting event to just the specific ones
    socket.on("login", async (uname, socket_id) => {
        console.log("trying to login", uname);
        const id = await User.findOne({ name: uname }).select("_id").exec();
        if (id) {
            socket.emit("logged_in", id);
            onlineUsers[id] = socket_id;
        } else socket.emit("wrong_cred");
    });

    socket.on("register", (uname) => {
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
      /*
     * On initial request all the posts of all the friends are sent to the client side
     * the posts that go to clients are array of objects and objects are formatted like this
    {
        _id     : id,
        comments: [
                {
                    _id      : id,
                    comment  : comment,
                    commentor: {
                        name: name,
                        id  : id,
                        date: date,
                        post: post_id
                    },
                    description: "what ever description of the post",
                    dislikes   : noOfDislikes,
                    likes      : noOfLikes,
                    media      : binary buffer data thingy,
                    reactions  : the reaction of this specific user
                    ! the name is reactions but it doesnt give list of all reactions just reaction of one user
                    time    : time,
                    uploader: {
                        id  : uploader id,
                        name: uploader name
                    }
                },
                  ];
    }
                */
    socket.on("initial_req", async (id) => {
        let friendlist = await User.findOne({ _id: id }).select("friends").exec();
        let posts      = await Post.aggregate([
            {
                $match: {
                    uploader: {
                        $in: friendlist.friends,
                    },
                },
            },
            {
                $project: {
                    uploader   : 1,
                    time       : 1,
                    description: 1,
                    media      : 1,
                    likes      : 1,
                    dislikes   : 1,
                    comments   : 1,
                    reactions  : {
                        $filter: {
                            input: "$reactions",
                            as   : "reaction",
                            cond : {
                                $eq: ["$$reaction.uid", new mongoose.Types.ObjectId(id)],
                            },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from        : "comments",
                    localField  : "comments",
                    foreignField: "_id",
                    as          : "comments",
                },
            },
            {
                $unwind: {
                    path                      : "$comments",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from        : "users",
                    localField  : "comments.commentor",
                    foreignField: "_id",
                    as          : "comments.commentor",
                },
            },
            {
                $addFields: {
                    "comments.commentor": {
                        $let: {
                            vars: {
                                commentor: {
                                    $arrayElemAt: ["$comments.commentor", 0],
                                },
                            },
                            in: {
                                name: "$$commentor.name",
                                id  : "$$commentor._id",
                            },
                        },
                    },
                },
            },
            {
                $group: {
                    _id     : "$_id",
                    comments: {
                        $push: "$comments",
                    },
                    uploader: {
                        $first: "$uploader",
                    },
                    time: {
                        $first: "$time",
                    },
                    description: {
                        $first: "$description",
                    },
                    media: {
                        $first: "$media",
                    },
                    likes: {
                        $first: "$likes",
                    },
                    dislikes: {
                        $first: "$dislikes",
                    },
                    reactions: {
                        $first: "$reactions",
                    },
                },
            },
            {
                $lookup: {
                    from        : "users",
                    localField  : "uploader",
                    foreignField: "_id",
                    as          : "uploader",
                },
            },
            {
                $addFields: {
                    uploader: {
                        $let: {
                            vars: {
                                postUploader: {
                                    $arrayElemAt: ["$uploader", 0],
                                },
                            },
                            in: {
                                name: "$$postUploader.name",
                                id  : "$$postUploader._id",
                            },
                        },
                    },
                },
            },
            {
                $addFields: {
                    reactions: {
                        $let: {
                            vars: {
                                reaction: {
                                    $arrayElemAt: ["$reactions", 0],
                                },
                            },
                            in: "$$reaction.reaction",
                        },
                    },
                },
            },
        ]).exec();
        socket.emit("initial_post", posts);
    });

    socket.on("post", async (user_id, description, image) => {
        console.log(user_id, description, image);
        let post = new Post({
            uploader   : user_id,
            description: description,
            media      : Buffer.from(image).toString("base64"),
        });
          // console.log(user.posts);
        post.save();
    });
    socket.on("liked", (uid, post_id, setReaction) => {
        Post.findOne({ _id: post_id }, "_id likes dislikes reactions")
            .exec()
            .then((document) => {
                for (let i of document.reactions) {
                      // console.log(i);
                    if (uid == i.uid) {
                        if (i.reaction == -1) {
                            document.dislikes -= 1;
                        }
                        if (i.reaction != 1) {
                            document.likes += 1;
                        }
                        i.reaction = 1;
                        document.save().then(() => {
                            setReaction(1);
                            console.log("savvyy???1");
                        });
                        return;
                    }
                }

                let reaction = { uid: uid, reaction: 1 };
                document.reactions.push(reaction);
                document.likes += 1;
                document.save().then(() => {
                    setReaction(1);
                    console.log("savvy??");
                });
            });
    });
    socket.on("disliked", (uid, post_id, setReaction) => {
        Post.findOne({ _id: post_id }, "_id likes dislikes reactions")
            .exec()
            .then((document) => {
                for (let i of document.reactions) {
                      // console.log(i);
                    if (uid == i.uid) {
                        if (i.reaction == 1) document.likes     -= 1;
                        if (i.reaction != -1) document.dislikes += 1;
                           i.reaction                            = -1;
                        document.save().then(() => {
                            setReaction(-1);
                            console.log("savved1");
                        });
                        return;
                    }
                }

                let reaction = { uid: uid, reaction: -1 };
                document.reactions.push(reaction);
                document.dislikes += 1;
                document.save().then(() => {
                    setReaction(-1);
                    console.log("savved");
                });
            });
    });
    socket.on("unreacted", (uid, post_id, reaction) => {
        if (reaction == 1) {
            Post.findOneAndUpdate(
                { _id: post_id },
                {
                    $pull: { reactions: { uid: new mongoose.Types.ObjectId(uid) } },
                    $inc : { likes: -1 },
                }
            ).exec();
        } else if (reaction == -1) {
            Post.findOneAndUpdate(
                { _id: post_id },
                {
                    $pull: { reactions: { uid: new mongoose.Types.ObjectId(uid) } },
                    $inc : { dislikes: -1 },
                }
            ).exec();
        }
    });

      // ! almost unwanted code should remove later
      // socket.on("ready", async (name) => {
      //     data    = await User.find().select("name").exec();
      //     friends = await User.findOne({ name: name }).select("friends").populate("friends").exec();
      //     uid     = await User.findOne({ name: name }).select("_id").exec();
      //     socket.emit("uid", uid);
      //     socket.emit("friends", friends);
      //     socket.emit("users", data);
      // });

    socket.on("friend_list", async (uid) => {
        data = await User.findOne({ _id: uid }).select("friends").populate("friends").exec();
        data.friends ? socket.emit("friends", data.friends): socket.emit("no_friends");
    });
      // * event emition are swapped with the way the db is updated cuz
      // * its needed to send uid and uname too and since i have alreay queried the data
      // * i thought of using it instead of accessing db again or storing the data in a variable
    socket.on("add_friend", async (uid, friendid) => {
        if ((await friend_is_unique(uid, friendid)) == 1) {
            User.findById(uid)
                .exec()
                .then((data) => {
                    data.friends.push(friendid);
                    data.save();
                    if (onlineUsers[friendid]) {
                        socket.to(onlineUsers[friendid]).emit("friend_added", uid, data.name);
                    }
                });
            User.findById(friendid)
                .exec()
                .then((data) => {
                    data.friends.push(uid);
                    data.save();

                    socket.emit("friend_added", friendid, data.name);
                });
        } else {
            socket.emit("exist");
        }
        console.log("friend:", friendid);
    });

    socket.on("comment", (post_, commentor, comment) => {
        comment = new Comment({
            post     : post_,
            comment  : comment,
            commentor: commentor,
        });
        comment.save().then((cmt) => {
            Post.findByIdAndUpdate(post_, { $push: { comments: String(cmt._id) } }).exec();
            console.log(String(cmt._id));
        });
    });
}

module.exports = socketfunc;
