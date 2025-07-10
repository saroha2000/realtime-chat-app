
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*"
  }
});

let users = {};

io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("register", (username) => {
    users[username] = socket.id;
  });

  socket.on("send_message", ({ from, to, message }) => {
    const targetSocket = users[to];
    if (targetSocket) {
      io.to(targetSocket).emit("receive_message", { from, message });
    }
  });

  socket.on("disconnect", () => {
    for (let username in users) {
      if (users[username] === socket.id) {
        delete users[username];
        break;
      }
    }
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
