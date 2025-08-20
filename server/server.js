const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const messageRoutes = require("./routes/message");
const connectDB = require("./config");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const Message = require("./models/Message"); // add this

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

// Connect Database
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("Chat app backend running");
});

// Socket.IO for real-time messaging
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a conversation room
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  // Listen for sending message
  socket.on("message:send", async ({ conversationId, sender, text }) => {
    try {
      // Save message to DB
      const newMessage = new Message({ conversationId, sender, text });
      await newMessage.save();

      // Emit to everyone in the same conversation room
      io.to(conversationId).emit("message:new", newMessage);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
