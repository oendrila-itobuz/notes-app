import express from 'express'
import { connectDB } from './config/db-connection.js';
import route from './src/routes/route.js'

const app = express();
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
})

connectDB();

app.use(express.json());
app.use("/user", route)