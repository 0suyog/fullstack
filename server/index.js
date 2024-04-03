const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
require("./database");
const socketfunc=require("./socket.handler")
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const User = require("./models/users.model");

io.on("connection", (socket) => {
  socketfunc(socket)
});

server.listen(3000, () => {
  console.log("server is running in port 3000");
});
