import userSchema from "../models/user-schema.js";
import sessionSchema from "../models/session-schema.js"
import statusCodes from "../config/constants.js";
import jwt from 'jsonwebtoken'


//checks if the acess token is valid also extracts the id and role of the user from it
export const hasToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "Access token is missing or invalid",
      });
    }
    else {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.secretKey, async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError")
            return res.status(statusCodes.BAD_REQUEST).json({
              success: false,
              message: "The access token has expired use the refresh token to regenerate it ",
            });
          else
            return res.status(statusCodes.UNAUTHORIZED).json({
              success: false,
              message: "The access token is invalid",
            });
        }
        else {
          const { id, role } = decoded;
          const user = await userSchema.findById(id);
          if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
              success: false,
              message: "User not found",
            });
          }
          const existing = await sessionSchema.findOne({ userId: id });
          if (existing) {
            req.userId = id,
              req.role = role
            next()
          }
          else {
            return res.status(statusCodes.BAD_REQUEST).json({
              success: true,
              message: "The user has logged out already",
            });
          }
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};