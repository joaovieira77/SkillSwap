// server/signaling.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from });
  });

  socket.on("answerCall", ({ signal, to }) => {
    io.to(to).emit("callAccepted", signal);
  });
});

server.listen(5050, () => console.log("Signaling ativo na porta 5050"));
