const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const axios = require("axios");

// Importa o cliente da OpenAI
const { Configuration, OpenAIApi } = require("openai");

// Configura o token da API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Defina sua chave aqui ou use variáveis de ambiente
});
const openai = new OpenAIApi(configuration);

// Função para fazer uma chamada de exemplo ao modelo GPT-3 ou GPT-4
async function callOpenAI() {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003", // ou "gpt-4", dependendo do seu modelo
      prompt: "Diga algo interessante sobre inteligência artificial",
      max_tokens: 50,
    });
    console.log(response.data.choices[0].text);
  } catch (error) {
    console.error("Erro ao chamar a API da OpenAI:", error);
  }
}

// Executa a função
callOpenAI();

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
