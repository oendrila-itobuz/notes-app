import userSchema from "../models/user-schema.js";

export const hasToken = async (req, res, next) => {
  try {
    const id = req.params.userId
    const data = await userSchema.findOne({ _id: id })
    if (data.accessToken.length !== 0) {
      next();
    }
    else {
      return res.status(401).json({ error: 'ACCESS TOKEN REQUIRED' })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not Accessss",
    })
  }
}