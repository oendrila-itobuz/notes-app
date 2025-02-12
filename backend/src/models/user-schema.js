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
  file:{
    type:String,
    default:""
  },
  role:{
    type:String,
    default:""
  }
})

export default mongoose.model("user", userSchema)