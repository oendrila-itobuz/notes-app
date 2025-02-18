import express from 'express'
import { connectDB } from './src/config/db-connection.js';
import route from './src/routes/user-route.js'
import routeNote from './src/routes/notes-route.js'
import routeChat from './src/routes/chats-route.js';
import dotenv from "dotenv";
dotenv.config()
import cors from 'cors';

const app = express();

const PORT = process.env.PORT

connectDB();

app.use(cors());
app.use(express.json());

app.use("/user", route)
app.use("/note", routeNote)
app.use("/chat",routeChat)
app.use("/uploads", express.static("uploads"))
app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
})