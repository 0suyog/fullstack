const mongoose = require("mongoose");
const User = require("../models/users.model");

async function friend_is_unique(id, friendid) {
  // const promise = new Promise((resolve, reject) => {
  let user = await User.findById(id);
  if (
    mongoose.Types.ObjectId.isValid(friendid) &&
    !user.friends.includes(friendid)
  ) {
    return 1;
  } else {
    return 0;
  }
  // if (mongoose.Types.ObjectId.isValid(friendid) && user.firends.indexOf(friendid) == -1) {
  //     resolve(1)
  // }
  // console.log(data.friends.indexOf(friendid));
  // if (
  //   mongoose.Types.ObjectId.isValid(friendid) &&
  //   data.friends.indexOf(friendid) == -1
  // ) {
  //   console.log("l", data.name);
  //   resolve 1;
  // }
  // })
  //   let user = await User.findById(id).then(async (data) => {
  //     console.log(data.friends.indexOf(friendid));
  //     if (
  //       mongoose.Types.ObjectId.isValid(friendid) &&
  //       data.friends.indexOf(friendid) == -1
  //     ) {
  //       console.log("\", data.name);
  //       return 1;
  //     }
  //     return 0;
  //   });
}

module.exports = friend_is_unique;
