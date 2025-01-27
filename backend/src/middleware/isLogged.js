import userSchema from "../models/user-schema.js";

export const isLogged = async (req, res, next) => {
  try {
    const id = req.params.userId
    const data = await userSchema.findOne({ _id: id })
    if (data.loggedIn === true) {
      next();
    }
    else {
      return res.status(401).json({ error: 'LOGIN REQUIRED' })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not Accesst",
    })
  }
}