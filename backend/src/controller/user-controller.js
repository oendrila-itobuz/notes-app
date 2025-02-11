import userSchema from "../models/user-schema.js";
import sessionSchema from "../models/session-schema.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mailSend } from "./../email-verify/verification.js";
import dotenv from "dotenv";
dotenv.config();

// user registration

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const existing = await userSchema.findOne({ email: email });
    if (existing) {
      return res.status(401).json({
        success: false,
        message: "User Already Exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userSchema.create({ userName, email, password: hashedPassword });
    const token = jwt.sign(
      { id: user._id },
      process.env.secretKey,
      { expiresIn: "3m" }
    );
    mailSend(token, email);
    user.token = token;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "User Registered Successfully",
      data: { userName: userName }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not Access"
    });
  }
};

//regenerate registration token (send the mail verification again)

export const resendMail = async (req,res) =>
{
  try{
  const {email} = req.body
  const user = await userSchema.findOne({email:email})
  if(user){
    const token = jwt.sign(
      { id: user._id },
      process.env.secretKey,
      { expiresIn: "1hr" }
    );
    user.token = token;
    await user.save();
    mailSend(token, email);
    return res.status(200).json({
      success: true,
      message: `Mail sent successfully at ${email}`,
    });
  }
  else{
    return res.status(404).json({
      success: false,
      message: "No such user found"
    })
  }
 }
  catch(error){
    return res.status(500).json({
      success: false,
      message: "Could not Access",
    });
  }

}


//login 

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userSchema.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ 
        success:false,
        error: 'Unauthorized Access' 
      });
    }
    else {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(402).json({ 
          success: false,
          error: 'Incorrect password' });
      }
      else if (passwordMatch && user.verified === true) {
        const existing = await sessionSchema.findOne({ userId: user._id });
        if (!existing)
          await sessionSchema.create({ userId: user._id })
        else {
          return res.status(200).json({
            message: "User's login session is active ",
          })
        }
        const accessToken = jwt.sign(
          {
            id: user._id
          },
          process.env.secretKey,
          { expiresIn: "8hr" }
        );
        const refreshToken = jwt.sign(
          {
            id: user._id
          },
          process.env.secretKey,
          { expiresIn: "30days" }
        );
        return res.status(200).json({
          success:true,
          message: "User logged In",
          accessToken: accessToken,
          refreshToken: refreshToken
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

//logout 

export const logout = async (req, res) => {
  const existing = await sessionSchema.findOne({ userId: req.userId });
  try {
    if (existing) {
      await sessionSchema.findOneAndDelete({ userId: req.userId });
      return res.status(200).json({
        success: true,
        message: "Session successfully ended"
      })
    }
    else {
      return res.status(404).json({
        success: false,
        message: "User had no session"
      })
    }
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not Access",
    })
  }
}

//regeneration of accesstoken using refreshtoken
export const regenerate = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is missing",
      });
    }
    else {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.secretKey, async (err, decoded) => {
        if (err) {
            return res.status(400).json({
              success: false,
              message: "The refresh token is invalid",
            });
        }
        else {
          const { id } = decoded;
          const user = await userSchema.findById(id);
          if (!user) {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          }
          const existing = await sessionSchema.findOne({ userId: id });
          if (existing) {
            const accessToken = jwt.sign(
              {
                id: user._id
              },
              process.env.secretKey,
              { expiresIn: "1h" }
            );
            return res.status(200).json({
              success: true,
              message: "The access token ",
              token: accessToken
            });
          }
          else {
            return res.status(200).json({
              success: true,
              message: "The user has logged out",
            });
          }
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Could not Access",
    });
  }
}

// user profile picture
export const attachFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const data = await userSchema.findOne({_id: req.userId})
    data.file = "http://localhost:8000/uploads/" + req.file.filename

    await data.save()
    res.status(200).json({
      success: true,
      message: "Profile Picture Added Successfully",
      data: data
    })
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}