import dotenv from "dotenv/config";
import userSchema from "../models/user-schema.js";
import jwt from 'jsonwebtoken'

//mail verification
export const verification = async (req, res) => {
  const { token } = req.params;
  const user = await userSchema.findOne({ token: token })
  if (user) {
    jwt.verify(token, process.env.secretKey, async function (err, decoded) {
      if (err) {
        console.log(err);
        res.send("Email verification failed,possibly the link is invalid or expired");
      }
      else {
        res.send("Email verified successfully");
        await userSchema.findOneAndUpdate({ token: token }, { $set: { token: "null", verified: "true" } }, { new: true, upsert: true })
      }
    });
  }
  else {
    res.send("Email already verified")
  }
}