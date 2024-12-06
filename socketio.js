const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const axios = require("axios");

io.on("connection", (socket) => {
  console.log("usuario conectado " + socket.id);
  socket.on("message", async (msg) => {
    try {
      // Ajustando a URL e o método HTTP
      const response = await axios({
        method: "get",
        url: "http://localhost:3001/openai/chat",
        data: {
          prompt: msg,
        },
      });
      console.log(response.data.prompt);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
    io.emit("message", msg);
  });
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
server.listen(3000);
