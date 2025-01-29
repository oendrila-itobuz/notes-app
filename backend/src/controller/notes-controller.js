import noteSchema from "../models/notes-schema.js";

// add note
export const addNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    const existing = await noteSchema.findOne({ title: title, userId: req.userId })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This title Already Exists",
      });
    }
    const data = await noteSchema.create({ title, description, userId: req.userId });
    if (data) {
      return res.status(200).json({
        success: true,
        message: "Note Created Success",
        data: [data._id, data.title, data.description]
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not access",
    });
  }
}

// all notes of an user
export const getNote = async (req, res) => {
  try {
    const data = await noteSchema.find({ userId: req.userId })
    if (data) {
      return res.status(200).json({
        success: true,
        message: "Fetched Successfully",
        data: data.map((data) => [data._id, data.title, data.description])
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

// get a particular note of an user by id
export const searchNote = async (req, res) => {
  try {
    const noteId = req.params.id
    const data = await noteSchema.findOne({ userId: req.userId, _id: noteId })
    if (data) {
      res.status(200).json({
        success: true,
        message: "Fetched Successfully",
        data: [data._id, data.title, data.description]
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
      data.updatedAt=Date.now()
      await data.save();
      res.status(200).json({
        success: true,
        message: "Updated Successfully",
        data: [data._id, data.title, data.description]
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

// filter notes by title

export const filterNote = async (req, res) => {
  try {
    const { title } = req.body
    const data = await noteSchema.find({ userId: req.userId })
    let flag = false;
    const filteredNotes = [];
    data.map((data) => {
      if (data.title.startsWith(title)) {
        flag = true
        filteredNotes.push({ title: data.title, description: data.description, NoteId: data._id })
      }
    })
    console.log(filteredNotes)
    if (flag === true) {
      return res.status(200).json({
        success: false,
        data: filteredNotes
      })
    }
    else {
      return res.status(200).json({
        success: false,
        message: "No matched title found ",
      })
    }
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not access",
    });
  }
}

//pagination of notes for an user 

export const pagination = async (req, res) => {
  try {
    const { limit, page } = req.body
    const offset = (page - 1) * limit;
    const notes = await noteSchema.find()
      .skip(offset)
      .limit(limit);

    res.status(200).json({
      totalResults: notes.length,
      output: notes.map(note => ({
        NoteId: note._id,
        title: note.title,
        description: note.description
      }))
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not access",
    });

  }
}

//notes sorting based on latest creation

export const sorting = async (req, res) => {
  try{
  const sortedDocuments = await noteSchema.find({ userId: req.userId }).sort({updateNoteAt:-1});
  return res.status(200).json({
    success: true,
    message: sortedDocuments,
  })
  }
  catch(error){
    res.status(500).json({ 
      message:error
    })
  }
}