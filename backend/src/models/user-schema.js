import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: "false"
  },
  token: {
    type: String,
    default: null
  },
  accessToken: {
    type: String,
    default: null
  },
  loggedIn: {
    type: Boolean,
    default: "false"
  }
})

export default mongoose.model("user", userSchema)