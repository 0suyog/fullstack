const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type  : String,
    unique: true,
  },
  friends: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref : "user",
      },
    ],
  },
});

const usermodel = mongoose.model("user", userSchema);

module.exports = usermodel;
