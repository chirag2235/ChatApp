const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    // origin: "https://chatapp-1-e74l.onrender.com",
    origin:"http://localhost:5173",
    credentials: true,
    
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("call:ringing", ({ from, to,offer }) => {
    const reciever = onlineUsers.get(to._id);
    console.log("Receiver socket ID: offer", reciever,offer); 
    if (reciever) {
      socket.to(reciever).emit("incoming:call", {to:from,offer});
      console.log(`Ringing user ${to}`);
    } else {
      socket.emit("call:failed", { message: "Receiver is not online." });
      return;
    }
  });
  socket.on("call:accept", ({ from, to,ans }) =>{
    const reciever = onlineUsers.get(to._id);
    if (reciever) {
      socket.to(reciever).emit("call:accepted", {to:from,ans});
      console.log(`Accepted call from ${from}`);
    } else {
      console.log("Receiver not online or not found:", to);
    }
  });

  socket.on("peer:nego:needed", ({ from, to,off }) => {
    const reciever = onlineUsers.get(to._id);
    io.to(reciever).emit("peer:nego:need",{from,off});
  });

  socket.on("peer:nego:done",({to,from,ans})=>{
    const reciever = onlineUsers.get(to._id);
    io.to(reciever).emit("peer:nego:final",{from,ans});
  })
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
