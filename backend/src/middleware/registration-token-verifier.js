import dotenv from "dotenv";
dotenv.config()
import userSchema from "../models/user-schema.js";
import jwt from 'jsonwebtoken'
import statusCodes from "../config/constants.js";

//mail verification
export const verification = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    }
    else {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.secretKey, async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(statusCodes.BAD_REQUEST).json({
              success: false,
              message: "The registration token has expired use your email to regenerate it ",
            });
          }
          return res.status(statusCodes.FORBIDDEN).json({
            success: false,
            message: "Token verification failed, possibly expired or invalid",
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
          else {
            user.token = null;
            user.verified = true;
            await user.save();
            return res.status(statusCodes.OK).json({
              success: true,
              message: "Email verified successfully",
            }
            )
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
