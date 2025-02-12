import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    required: true,
  },
  file:{
    type:String,
    default:""
  },
  author:{
    type:String,
    default:""
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model("note", noteSchema)