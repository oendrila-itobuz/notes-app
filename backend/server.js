import express from 'express';
import { createServer } from 'http'; 
import { Server } from 'socket.io';  
import { connectDB } from './src/config/db-connection.js';
import route from './src/routes/user-route.js';
import routeNote from './src/routes/notes-route.js';
import routeChat from './src/routes/chats-route.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const server = createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/user", route);
app.use("/note", routeNote);
app.use("/chat", routeChat);
app.use("/uploads", express.static("uploads"));

io.on("connection", (socket) => {
  console.log(`User connected:`,socket.id);  
  socket.on("join_room", (data) => {
    console.log("join room :", data);
    socket.join(data);
  });

  socket.on("sendMessage", (data) => {
    console.log("Received message:", data);
    io.to(data.receiverId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
