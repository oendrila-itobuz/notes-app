import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { 
    type:String,
    required:true
  },
  description: {
    type:String,
    required:true
  },
  noteId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true,
  }
})

export default mongoose.model("note", noteSchema)