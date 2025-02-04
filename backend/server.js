import express from 'express'
import { connectDB } from './src/config/db-connection.js';
import route from './src/routes/user-route.js'
import routeNote from './src/routes/notes-route.js'
import dotenv from "dotenv/config";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
})

connectDB();

app.use(cors());
// const corsOptions ={
//   origin:'*', 
//   credentials:true,            //access-control-allow-credentials:true
//   optionSuccessStatus:200,
// }
app.use(express.json());
app.use("/user", route)
app.use("/note", routeNote)
app.use("/uploads",express.static("uploads"))