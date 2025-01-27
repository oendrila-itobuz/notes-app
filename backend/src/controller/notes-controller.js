import noteSchema from "../models/notes-schema.js";

// add note
export const addNote = async (req, res) => {
  try {
    const userId = req.params.userId
    const { title, description } = req.body;
    const response = await noteSchema.create({ title, description, userId });

    if (response) {
      res.status(200).json({
        success: true,
        data: response,
        message: "Note Created Success",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Could not acckess",
    });
  }
}

// all notes of an user
export const getNote = async (req, res) => {
  try {
    const id = req.params.userId
    const data = await noteSchema.find({ userId: id })
    if (data) {
      res.status(200).json({
        success: true,
        message: "Fetched Successfully",
        data: data
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
    const userId = req.params.userId
    const noteId = req.params.id
    const data = await noteSchema.find({ userId: userId, _id: noteId })
    if (data) {
      res.status(200).json({
        success: true,
        message: "Fetched Successfully",
        data: data
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
    const userId = req.params.userId
    const noteId = req.params.id
    console.log(noteId)
    const data = await noteSchema.findByIdAndUpdate({ userId: userId, _id: noteId })
    console.log(data)
    if (data) {
      data.title = title;
      data.description = description;
      await data.save();
      res.status(200).json({
        success: true,
        message: "Updated Successfully",
        data: data
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
    const userId = req.params.userId
    const noteId = req.params.id
    const data = await noteSchema.findByIdAndDelete({ userId: userId, _id: noteId })
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