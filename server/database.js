const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/fb");
mongoose.connection.on("connect", () => {
  console.log("db connected");
});
process.on("SIGINT", () => {
  mongoose.disconnect();
  process.exit();
});
