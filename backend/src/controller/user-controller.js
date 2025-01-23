import userSchema from "../models/user-schema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { mailSend } from "../../email-verify/verification.js";

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
      mailSend(token)
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

export const verification = async (req, res) => {
  const {token} = req.params;
    jwt.verify (token, 'secretkeyappearshere', function(err, decoded) {
        if (err) {
            console.log(err);
            res.send("Email verification failed,possibly the link is invalid or expired");
        }
        else {
            res.send("Email verified successfully");
            const { userName, email, password  } = req.body
            userSchema.findOneAndUpdate({ token: token },{ $set: {token:"null"}},{ new: true, upsert: true })
           
        }
    });
}