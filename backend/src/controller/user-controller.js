import dotenv from "dotenv";
dotenv.config();
import statusCodes from "../config/constants.js";
import userSchema from "../models/user-schema.js";
import notesSchema from "../models/notes-schema.js";
import sessionSchema from "../models/session-schema.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mailSend } from "./../email-verify/verification.js";

// user registration
export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const existing = await userSchema.findOne({ email: email });
    if (existing) {
      return res.status(statusCodes.BAD_REQUEST).json({
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
    return res.status(statusCodes.CREATED).json({
      success: true,
      message: "User Registered Successfully",
      data: { userName: userName }
    });
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

//regenerate registration token (send the mail verification again)
export const resendMail = async (req, res) => {
  try {
    const { email } = req.body
    const user = await userSchema.findOne({ email: email })
    if (user) {
      const token = jwt.sign(
        { id: user._id },
        process.env.secretKey,
        { expiresIn: "1hr" }
      );
      user.token = token;
      await user.save();
      mailSend(token, email);
      return res.status(statusCodes.OK).json({
        success: true,
        message: `Mail sent successfully at ${email}`,
      });
    }
    else {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "No such user found"
      })
    }
  }
  catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }

}


//login 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userSchema.findOne({ email: email });
    if (!user) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        success: false,
        error: 'Unauthorized Access',
      });
    }
    else {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(statusCodes.UNAUTHORIZED).json({
          success: false,
          error: 'Unauthorized Access'
        });
      }
      else if (passwordMatch && user.verified === true) {
        const existing = await sessionSchema.findOne({ userId: user._id });
        if (!existing)
          await sessionSchema.create({ userId: user._id })
        else {
          return res.status(statusCodes.BAD_REQUEST).json({
            message: "User's login session is already active ", //for single device
          })
        }
        const accessToken = jwt.sign(
          {
            id: user._id,
            role: user.role
          },
          process.env.secretKey,
          { expiresIn: "10hr" }
        );
        const refreshToken = jwt.sign(
          {
            id: user._id,
            role: user.role
          },
          process.env.secretKey,
          { expiresIn: "30days" }
        );
        return res.status(statusCodes.OK).json({
          success: true,
          message: "User logged In",
          accessToken: accessToken,
          refreshToken: refreshToken,
          data: user
        })
      }
      else {
        res.status(statusCodes.FORBIDDEN).json({
          message: "Complete Email verification before login"
        })
      }
    }
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

//logout 
export const logout = async (req, res) => {
  const existing = await sessionSchema.findOne({ userId: req.userId });
  try {
    if (existing) {
      await sessionSchema.findOneAndDelete({ userId: req.userId });
      return res.status(statusCodes.OK).json({
        success: true,
        message: "Session successfully ended"
      })
    }
    else {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "User had no session"
      })
    }
  }
  catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    })
  }
}

//regeneration of accesstoken using refreshtoken
export const regenerate = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Refresh token is missing",
      });
    }
    else {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.secretKey, async (err, decoded) => {
        if (err) {
          return res.status(statusCodes.UNAUTHORIZED).json({
            success: false,
            message: "The refresh token is invalid",
          });
        }
        else {
          const { id } = decoded;
          const user = await userSchema.findById(id);
          if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
              success: false,
              message: "User not found",
            });
          }
          const existing = await sessionSchema.findOne({ userId: id });
          if (existing) {
            const accessToken = jwt.sign(
              {
                id: user._id,
                role: user.role
              },
              process.env.secretKey,
              { expiresIn: "1h" }
            );
            return res.status(statusCodes.OK).json({
              success: true,
              message: "The access token is :",
              token: accessToken
            });
          }
          else {
            return res.status(statusCodes.FORBIDDEN
            ).json({
              success: true,
              message: "The user has logged out already",
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
      return res.status().send('No file uploaded.');
    }
    const data = await userSchema.findOne({ _id: req.userId })
    data.file = "http://localhost:8000/uploads/" + req.file.filename

    await data.save()
    res.status(statusCodes.OK).json({
      success: true,
      message: "Profile Picture Added Successfully",
      data: data
    })
  }
  catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
}

//get-user
export const getUser = async (req, res) => {
  try {
    const user = await userSchema.findById({ _id: req.userId })
    res.status(statusCodes.OK).json({
      success: true,
      message: "User Retrieved",
      data: user
    })
  }
  catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
}

//get all user (for admin)
export const getAllUser = async (req, res) => {
  try {
    const user = await userSchema.findById({ _id: req.userId })
    const users = await userSchema.find({ role: "user" })
    if (!user) {
      {
        return res.status(statusCodes.NOT_FOUND).json({
          success: false,
          error: 'User does not exist',
        });
      }
    }
    else if (user.role !== "admin") {
      return res.status(statusCodes.UNAUTHORIZED).json({
        success: false,
        error: 'Unauthorized Access',
      });
    }
    else {
      res.status(statusCodes.OK).json({
        success: true,
        message: "Users Retrieved",
        data: users
      })
    }
  }
  catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
}
//get all admin(user)
export const getAllAdmin = async (req, res) => {
  try {
    const user = await userSchema.findById({ _id: req.userId })
    const users = await userSchema.find({ role: "admin" })
    if (!user) {
      {
        return res.status(statusCodes.NOT_FOUND).json({
          success: false,
          error: 'Admin does not exist',
        });
      }
    }
   else {
      res.status(statusCodes.OK).json({
        success: true,
        message: "Admins Retrieved",
        data: users
      })
    }
  }
  catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
}
// user deletion by admin 
export const deleteUser = async (req, res) => {
  try {
    const role = req.role
    if (role === "admin") {
      const { userId } = req.body
      const user = await userSchema.findByIdAndDelete({ _id: userId })
      if (user) {
        await notesSchema.deleteMany({ userId: userId })
        await sessionSchema.deleteMany({ userId: userId })
        res.status(statusCodes.OK).json({
          success: true,
          message: "Deleted Successfully",
        })
      }
      else
        res.status(statusCodes.NOT_FOUND).json({
          success: false,
          message: "No such data found",
        })
    }
    else {
      res.status(statusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized access",
      })
    }
  }

  catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    })
  }
}