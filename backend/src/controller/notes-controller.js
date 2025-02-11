import noteSchema from "../models/notes-schema.js";
import userSchema from "../models/user-schema.js";
// add note
export const addNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    const existing = await noteSchema.findOne({ title: title.trim(), userId: req.userId })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This title Already Exists",
      });
    }
    const data = await noteSchema.create({ title: title, description: description, userId: req.userId });
    if (data) {
      return res.status(200).json({
        success: true,
        message: "Note Created Success",
        data: [data]
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
}

// all notes of an user
export const getNote = async (req, res) => {
  try {
    const data = await noteSchema.find({ userId: req.userId })
    const user = await userSchema.findById({ _id: req.userId })
    if (data) {
      return res.status(200).json({
        success: true,
        message: "Fetched Successfully",
        user:user.userName,
        data: data
      })
    }
    else {
      return res.status(404).json({
        success: true,
        message: "This user has no notes",
      })
    }
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: error,
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
        data: [{ noteId: data._id, Title: data.title, description: data.description }]
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
      message: error,
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
      const existing = await noteSchema.findOne({ title: title, userId: req.userId })
      console.log(existing)
      if (existing) {
        res.status(400).json({
          success: false,
          message: "The title already exists",
        })
      }
      else {
        data.title = title;
        data.description = description;
        data.updatedAt = Date.now()
        await data.save();
        res.status(200).json({
          success: true,
          message: "Updated Successfully",
          data: data
        })
      }
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
      message: error,
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
    else
      res.status(400).json({
        success: true,
        message: "No such data found",
      })
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: error,
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
        success: true,
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
      message: error,
    });
  }
}

//pagination of notes for an user 

export const pagination = async (req, res) => {
  try {
    const { limit, page } = req.body
    const offset = (page - 1) * limit;
    const notes = await noteSchema.find({ userId: req.userId })
      .skip(offset)
      .limit(limit);
    const user = await userSchema.findById({ _id: req.userId })
    res.status(200).json({
      success:true,
      user:user.userName,
      data:notes
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });

  }
}

//notes sorting based on latest updation

export const sorting = async (req, res) => {
  try {
    const { order } = req.body
    const sortedDocuments = await noteSchema.find({ userId: req.userId }).sort({ updatedAt: order, title: order });
    return res.status(200).json({
      success: true,
      message: sortedDocuments,
    })
  }
  catch (error) {
    res.status(500).json({
      message: error
    })
  }
}

//upload file
export const attachFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const noteId = req.params.id
    const data = await noteSchema.findOne({ userId: req.userId, _id: noteId })
    data.file = "http://localhost:8000/uploads/" + req.file.filename

    await data.save()
    res.status(200).json({
      success: true,
      message: "Folder Added Successfully",
      data: data
    })
  }
  catch (error) {
    res.status(500).json({
      message: error
    })
  }
}


//together Sorting pagination and get all notes

export const getAllNotes = async (req, res) => {
  try {
    const { order } = req.body
    const data = await noteSchema.find({ userId: req.userId }).sort({ updatedAt: order, title: order })
    const user = await userSchema.findById({ _id: req.userId })
    if (data) {
      return res.status(200).json({
        success: true,
        message: "Fetched Successfully",
        user:user.userName,
        data: data
      })
    }
    else {
      return res.status(404).json({
        success: true,
        message: "This user has no notes",
      })
    }
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    })
  }
}

// getAll sort search paginate

export const allChecks = async(req,res)=>
{
  const limit=4
  const { title,page,order } = req.body
  const offset = (page - 1) * limit;
  try{
  const total =await noteSchema.countDocuments({userId:req.userId})
  const notes = await noteSchema.find({ userId: req.userId , title:{"$regex":title,$options:'i'}}).sort({ updatedAt: order, title: order }).skip(offset).limit(limit)
  const user = await userSchema.findById({ _id: req.userId }) 
  const totalpages=Math.ceil(total/limit)
  return res.status(200).json({
    success: true,
    message: notes,
    user:user.userName,
    totalpages:totalpages
  })
}
catch (error) {
  res.status(500).json({
    message: error.message
  })
}
}