import mongoose from 'mongoose'

export const noteSchema = new mongoose.Schema ({
  title: { 
    type:String,
    required:true
  },
  description: {
    type:String,
    required:true
  },
})

export default mongoose.model("note", noteSchema)

