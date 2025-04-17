const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");

// Load environment variables from .env
dotenv.config();

const app = express();

// CORS setup
app.use(
  cors({
    origin: "https://chat-app-a9ww.vercel.app" || "*" ,
  })
);

// Middleware
app.use(express.json());

// MongoDB Connection
const connect_db = async () => {
  try {
    if (!process.env.DATABASE) {
      throw new Error("DATABASE URI is missing in .env");
    }

    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to database:", error.message);
    process.exit(1);
  }
};

connect_db();

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Chat Now 2023");
});

app.use("/user", userRoutes);
app.use("/chats", chatRoutes);
app.use("/message", messageRoutes);

// Server Listen
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Socket.IO setup
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
  pingTimeout: 60000,
});

const onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("setup", (userId) => {
    onlineUsers[userId] = socket.id;
    socket.join(userId);
    socket.emit("connected");
    io.emit("user online", userId);
  });

  socket.on("disconnect", () => {
    const userId = Object.keys(onlineUsers).find(
      (key) => onlineUsers[key] === socket.id
    );

    if (userId) {
      delete onlineUsers[userId];
      io.emit("user offline", userId);
    }
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing", room));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing", room));

  socket.on("new message", (newMessageStatus) => {
    const chat = newMessageStatus.chat;

    if (!chat.users) {
      return console.log("chat.users not found");
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageStatus.sender._id) return;
      socket.in(user._id).emit("message received", newMessageStatus);
    });
  });
});
