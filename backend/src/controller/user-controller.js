import userSchema from "../models/user-schema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body
    const duplicate = await userSchema.findOne({ email: email })
    if (duplicate) {
      res.status(400).json({
        success: false,
        message: "User Already Exists"
      })
    }
    else {
      const token = jwt.sign(
        {
        },
        "secretkeyappearshere",
        { expiresIn: "1h" }
      );
      const user = await userSchema.create({ userName, email, password, token })
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(user.password, salt)
      user.password = hashedPassword;
      await user.save()
      if (user) {
        res.status(200).json({
          success: true,
          message: "User Registered Successfully",
          data: user
        })
      }
    }
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not Access",
    })
  }
}