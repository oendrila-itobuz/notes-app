import express from 'express';
import { createServer } from 'http';  // Import HTTP server
import { Server } from 'socket.io';  // Import Socket.IO
import { connectDB } from './src/config/db-connection.js';
import route from './src/routes/user-route.js';
import routeNote from './src/routes/notes-route.js';
import routeChat from './src/routes/chats-route.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const server = createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow frontend connection
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT;

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/user", route);
app.use("/note", routeNote);
app.use("/chat", routeChat);
app.use("/uploads", express.static("uploads"));

// WebSocket Handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handling incoming messages
  socket.on("sendMessage", (data) => {
    console.log("Received message:", data);
    io.to(data.receiverId).emit("receiveMessage", data); // Send to receiver
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
