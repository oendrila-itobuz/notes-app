import noteSchema from "../models/notes-schema.js";

// add note
export const addNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    const existing = await noteSchema.findOne({title:title,userId:req.userId})
    if(existing)
    {
      return res.status(400).json({
        success: false,
        message: "This title Already Exists",
      });
    }
    const data = await noteSchema.create({ title, description,userId:req.userId});
    if (data) {
      res.status(200).json({
        success: true,
        message: "Note Created Success",
        data:[data.userId,data.title,data.description]
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Could not access",
    });
  }
}

// all notes of an user
export const getNote = async (req, res) => {
  try {
    const data = await noteSchema.find({ userId: req.userId })
    console.log(data)
    if (data) {
      // const fewfields=
      res.status(200).json({
        success: true,
        message: "Fetched Successfully",
        data: data.map((data)=>[data._id, data.title , data.description])
      })
    }
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Cannot Fetch Successfully",
    })
  }
}

// get a particular note of an user
export const searchNote = async (req, res) => {
  try {
    const noteId = req.params.id
    const data = await noteSchema.findOne({ userId: req.userId, _id: noteId })
    if (data) {
      res.status(200).json({
        success: true,
        message: "Fetched Successfully",
        data: [data.userId,data.title,data.description]
      })
    }
    else {
      res.status(200).json({
        success: false,
        message: "No such note exists",
      })
    }
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Cannot Fetch Successfully",
    })
  }
}

//update a particular note of an user

export const updateNote = async (req, res) => {
  try {
    const { title, description } = req.body
    const noteId = req.params.id
    const data = await noteSchema.findByIdAndUpdate({ userId: req.userId, _id: noteId })
    if (data) {
      data.title = title;
      data.description = description;
      await data.save();
      res.status(200).json({
        success: true,
        message: "Updated Successfully",
        data: [data.userId,data.title,data.description]
      })
    }
    else{
      res.status(200).json({
        success: false,
        message: "No such note exists",
      })
    }
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Update not done",
      data: null
    })
  }
}

//delete a particular note of an user

export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id
    const data = await noteSchema.findByIdAndDelete({ userId: req.userId, _id: noteId })
    if (data) {
      res.status(200).json({
        success: true,
        message: "Deleted Successfully",
      })
    }
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Deletion not done",
      data: null
    })
  }
}