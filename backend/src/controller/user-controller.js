import userSchema from "../models/user-schema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { mailSend } from "./../email-verify/verification.js";
import dotenv from "dotenv/config";

// user registration

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const duplicate = await userSchema.findOne({ email: email });
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userSchema.create({userName, email, password: hashedPassword});
    const token = jwt.sign(
      { id: user._id },
      process.env.secretKey,
      { expiresIn: "1h" }
    );
    mailSend(token, email);
    user.token = token;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "User Registered Successfully",
      data: { id: user._id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not Access",
    });
  }
};

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
            id: user._id 
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