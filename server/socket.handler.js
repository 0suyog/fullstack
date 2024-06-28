const User = require("./models/users.model");
const Post = require("./models/post.model");
const Comment = require("./models/comment.model");
const Reaction = require("./models/reaction.model");
const friend_is_unique = require("./middlewares/friends_validator");
const mongoose = require("mongoose");
const randomSentence = require("random-sentence");
// import { generate, count } from "random-words";
const imgGen = require("js-image-generator");
let onlineUsers = {};
async function socketfunc(socket) {
    socket.on("sendall", () => {
        User.find()
            .select("-friends")
            .exec()
            .then((data) => {
                socket.emit("users", data);
            });
    });
    // let img
    // imgGen.generateImage(800, 600, 80,(err,image) => {
    //     img= image;
    // })
    // // console.log(img)
    // ! Test code to fill db with dummy data
    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    socket.on("dummy_post", (id) => {
        for (let i = 0; i < 10; i++) {
            let image;
            imgGen.generateImage(800, 600, 80, (err, img) => {
                image = img;
            });
            let date = randomDate(new Date(1990, 0, 1), new Date());
            let post = new Post({
                uploader: id,
                description: date,
                media: Buffer.from(image.data).toString("base64"),
                time: date,
            });
            post.save();
        }
    });

    // //   ! I am trying to make friend requests and adding friends synchronize with both users
    // // ! for that using same method as the messaging app storing all the users id with thheir socket id
    // // ! in a object then emitting event to just the specific ones
    socket.on("login", async (uname, socket_id) => {
        User.findOne({ name: uname })
            .select("_id name")
            .exec()
            .then((user) => {
                socket.emit("logged_in", user);
                onlineUsers[user._id.toString()] = socket_id;
                // console.log("trying to login", uname);
            })
            .catch((e) => {
                socket.emit("wrong_cred");
            });
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
                        id  : id},
                        date: date,
                        post: post_id
                    ]
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
                  ;
    }
                */
    socket.on("initial_req", async (id) => {
        let friendlist = await User.findOne({ _id: id }).select("friends").exec();
        console.log(friendlist);
        let posts = await Post.aggregate([
            {
                $match: {
                    uploader: {
                        $in: friendlist.friends,
                    },
                },
            },
            {
                $sort: {
                    _id: -1,
                },
            },
            {
                $limit: 10,
            },
            {
                $project: {
                    uploader: 1,
                    time: 1,
                    description: 1,
                    media: 1,
                    likes: 1,
                    dislikes: 1,
                    comments: 1,
                    reactions: {
                        $filter: {
                            input: "$reactions",
                            as: "reaction",
                            cond: {
                                $eq: ["$$reaction.uid", new mongoose.Types.ObjectId(id)],
                            },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "comments",
                    foreignField: "_id",
                    as: "comments",
                },
            },
            {
                $unwind: {
                    path: "$comments",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "comments.commentor",
                    foreignField: "_id",
                    as: "comments.commentor",
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
                                id: "$$commentor._id",
                            },
                        },
                    },
                },
            },
            {
                $sort: { "comments._id": -1 },
            },
            {
                $group: {
                    _id: "$_id",
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
                    from: "users",
                    localField: "uploader",
                    foreignField: "_id",
                    as: "uploader",
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
                                id: "$$postUploader._id",
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
            {
                $sort: { _id: -1 },
            },
        ]).exec();
        posts.forEach((post) => {
            // console.log(post.description)
        });
        socket.emit("initial_post", posts);
    });
    socket.on("more_posts", async (uid, first_date, last_date) => {
        let friendlist = await User.findOne({ _id: uid }).select("friends").exec();
        let dates=[]
        const posts = Post.aggregate([
            {
                $match: {
                    uploader: {
                        $in: friendlist.friends,
                    },
                    $or: [
                        {
                            time: {
                                $gt: new Date(first_date),
                            },
                        },
                        {
                            time: {
                                $lt: new Date(last_date),
                            },
                        },
                    ],
                },
            },
            {
                $sort: {
                    _id: -1,
                },
            },
            {
                $limit: 10,
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "commentor",
                    foreignField: "_id",
                    as: "comments",
                },
            },
            {
                $unwind: {
                    path: "$comments",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "comments.commentor",
                    foreignField: "_id",
                    as: "comments.commentor",
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
                                id: "$$commentor._id",
                            },
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$_id",
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
                $addFields: {
                    reactions: {
                        $let: {
                            vars: {
                                reaction: {
                                    $filter: {
                                        input: "$reactions",
                                        as: "r",
                                        cond: {
                                            $eq: ["$$r.uid", new mongoose.Types.ObjectId(uid)],
                                        },
                                    },
                                },
                            },
                            in: "$$reaction",
                        },
                    },
                },
            },
            {
                $addFields: {
                    reactions: {
                        $let: {
                            vars: {
                                r: {
                                    $arrayElemAt: ["$reactions", 0],
                                },
                            },
                            in: "$$r.reaction",
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "uploader",
                    foreignField: "_id",
                    as: "uploader",
                },
            },
            {
                $addFields: {
                    uploader: {
                        $let: {
                            vars: {
                                u: {
                                    $arrayElemAt: ["$uploader", 0],
                                },
                            },
                            in: {
                                id: "$$u._id",
                                name: "$$u.name",
                            },
                        },
                    },
                },
            },
            {
                $sort: {
                    _id: -1,
                },
            },
        ])
            .exec()
            .then((posts) => {
                console.log(first_date, last_date);
                if (posts) {
                    for (let i in posts){
                        if (((new Date(i.time) > new Date(last_date)) && !(new Date(i.time) < new Date(first_date))) || (!(new Date(i.time) > new Date(last_date)) && (new Date(i.time) < new Date(first_date)))) {
                            console.log(true)
                        }
                    }
                }
                console.log("\n")
                // // console.log(posts);
                socket.emit("sending_more_posts", posts);
            });
    });
    // send all comments for a singular post
    socket.on("comments_of_post", (id) => {
        Post.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                },
            },
            {
                $project: {
                    comments: 1,
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "comments",
                    foreignField: "_id",
                    as: "comments",
                },
            },
            {
                $unwind: {
                    path: "$comments",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "comments.commentor",
                    foreignField: "_id",
                    as: "comments.commentor",
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
                                id: "$$commentor._id",
                            },
                        },
                    },
                },
            },
            {
                $sort: {
                    comments: -1,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    comments: {
                        $push: "$comments",
                    },
                },
            },
        ]).then((post) => {
            // // console.log(post)
            socket.emit("all_comments", post[0].comments, id);
        });
    });
    // TODO will make posts be sent regularly
    /*
     *logic is that for the initial posts we will first send first 10 data sorted by date
     *then after scroller has reached around to 7 posts mark an event will be emitted
     *with the last posts date and also first post datefrom client and on response to that
     *another 10 posts will be sent by server that are older than the provided date
     *and in case of any new posts are uploaded during this time they will also be included
     *in that 10 posts retrieved by comparing posts newer than first post date
     *and since each individual sockets will send their own events no need to do jhanjhat about
     *sending event to different users
     */
    socket.on("post", async (user_id, description, image) => {
        // console.log(user_id, description, image);
        let post = new Post({
            uploader: user_id,
            description: description,
            media: Buffer.from(image).toString("base64"),
        });
        // console.log(post.time)
        post.save().then((post) => {
            socket.emit("post_added", post);
            // // console.log(post)
        });
    });
    socket.on("liked", (uid, post_id, setReaction) => {
        Post.findOne({ _id: post_id }, "_id likes dislikes reactions")
            .exec()
            .then((document) => {
                for (let i of document.reactions) {
                    // // console.log(i);
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
                            // console.log("savvyy???1");
                        });
                        return;
                    }
                }

                let reaction = { uid: uid, reaction: 1 };
                document.reactions.push(reaction);
                document.likes += 1;
                document.save().then(() => {
                    setReaction(1);
                    // console.log("savvy??");
                });
            });
    });
    socket.on("disliked", (uid, post_id, setReaction) => {
        Post.findOne({ _id: post_id }, "_id likes dislikes reactions")
            .exec()
            .then((document) => {
                for (let i of document.reactions) {
                    // // console.log(i);
                    if (uid == i.uid) {
                        if (i.reaction == 1) document.likes -= 1;
                        if (i.reaction != -1) document.dislikes += 1;
                        i.reaction = -1;
                        document.save().then(() => {
                            setReaction(-1);
                            // console.log("savved1");
                        });
                        return;
                    }
                }

                let reaction = { uid: uid, reaction: -1 };
                document.reactions.push(reaction);
                document.dislikes += 1;
                document.save().then(() => {
                    setReaction(-1);
                    // console.log("savved");
                });
            });
    });
    socket.on("unreacted", (uid, post_id, reaction) => {
        if (reaction == 1) {
            Post.findOneAndUpdate(
                { _id: post_id },
                {
                    $pull: { reactions: { uid: new mongoose.Types.ObjectId(uid) } },
                    $inc: { likes: -1 },
                }
            ).exec();
        } else if (reaction == -1) {
            Post.findOneAndUpdate(
                { _id: post_id },
                {
                    $pull: { reactions: { uid: new mongoose.Types.ObjectId(uid) } },
                    $inc: { dislikes: -1 },
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
        data.friends ? socket.emit("friends", data.friends) : socket.emit("no_friends");
    });
    // * event emition are swapped with the way the db is updated cuz
    // * its needed to send uid and uname too and since i have alreay queried the data
    // * i thought of using it instead of accessing db again or storing the data in a variable
    socket.on("add_friend", async (uid, friendid) => {
        if ((await friend_is_unique(uid, friendid)) == 1) {
            // console.log(onlineUsers);
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
        // console.log("friend:", friendid);
    });
    socket.on("search_user", (uname) => {
        const regex = new RegExp(uname, "i");
        User.find({ name: { $regex: regex } })
            .select("name _id")
            .limit(6)
            .exec()
            .then((users) => {
                // console.log(users);
                socket.emit("searched_users", users);
            });
    });

    socket.on("comment", (post, commentor, comment) => {
        comment = new Comment({
            post: post,
            comment: comment,
            commentor: commentor,
        });
        comment.save().then((cmt) => {
            Post.findByIdAndUpdate(post, { $push: { comments: String(cmt._id) } }).exec();
            // console.log(post);
            socket.emit("comment_added", cmt);
        });
    });
    socket.on("profile", (id) => {
        Post.aggregate()
    })
}

module.exports = socketfunc;
