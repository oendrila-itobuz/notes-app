import dotenv from "dotenv/config";
import userSchema from "../models/user-schema.js";
import jwt from 'jsonwebtoken'

//mail verification

export const verification = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    }
 else{
 const token = authHeader.split(' ')[1];
 jwt.verify(token, process.env.secretKey, async (err, decoded) => {
   if (err) {
     return res.status(400).json({
       success: false,
       message: "Token verification failed, possibly expired or invalid",
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
   else if (user.verified === true) {
     return res.status(200).json({
       success: true,
       message: "Email is already verified",
     });
   }
   else{  
   user.token = null; 
   user.verified = true; 
   await user.save();
   return res.status(200).json({
     success: true,
     message: "Email verified successfully",
   });
 }}});
    }  
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during email verification",
    });
  }
};
