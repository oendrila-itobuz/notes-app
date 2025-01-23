import mongoose from 'mongoose';

const url = "mongodb+srv://oendrila:1234@cluster0.ip9cg.mongodb.net/";

export async function connectDB () {
  await mongoose.connect(url)
      .then(() => console.log('MongoDB connected'))
      .catch((error) => console.log('Not connected'+error));
}
