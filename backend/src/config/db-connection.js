import mongoose from 'mongoose';
import dotenv from "dotenv/config";

const url = process.env.connectionString;

export async function connectDB() {
  await mongoose.connect(url)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log('Not connected' + error));
}
