const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
io.on("connection", (socket) => {
  console.log("usuario conectado " + socket.id);
  socket.on("message", (msg) => {
    console.log(msg);
    io.emit("message", msg);
  });
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
server.listen(3000);