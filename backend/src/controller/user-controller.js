import userSchema from "../models/user-schema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { mailSend } from "./../email-verify/verification.js";
import dotenv from "dotenv/config";

//registration
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
        process.env.secretKey,
        { expiresIn: "1h" }
      );

      mailSend(token, email)
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

//login 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userSchema.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: 'This email is not registered' });
    }
    else {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Incorrect password' });
      }
      else if (passwordMatch && user.verified === true) {
        const accessToken = jwt.sign(
          {
          },
          process.env.secretKey,
          { expiresIn: "1h" }
        );
        await userSchema.findOneAndUpdate({ email: email }, { $set: { accessToken: accessToken, loggedIn: "true" } }, { new: true, upsert: true })
        res.status(200).json({
          message: "User logged In"
        })
      }
      else {
        res.status(200).json({
          message: "Complete Email verification before login"
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