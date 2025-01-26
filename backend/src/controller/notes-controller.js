import noteSchema from "../models/notes-schema.js";

export const addNote = async (req,res) => {
    try {
        const { title, description , noteId } = req.body;
        const response = await noteSchema.create({ title, description, noteId });
    
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
          message: "Could not access",
        });
      }
    }
