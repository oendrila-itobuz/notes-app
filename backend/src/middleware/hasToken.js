import userSchema from "../models/user-schema.js";
import sessionSchema from "../models/session-schema.js"
import jwt from 'jsonwebtoken'

export const hasToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing or invalid",
      });
    }
    else {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.secretKey, async (err, decoded) => {
        if (err) {
          if(err.name==="TokenExpiredError")
          return res.status(400).json({
            success: false,
            message: "The access token has expired use the refresh token to regenerate it ",
          });
          else
          return res.status(400).json({
            success: false,
            message: "The access token is invalid",
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
          if(existing)
          {
            req.userId = id
            next()
          }
          else  {
            return res.status(200).json({
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
};