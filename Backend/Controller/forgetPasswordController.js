import UserModel from "../Model/User.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { emailForget } from "../Utils/EmailSend/SendForgetPassword/emailForget.js";

dotenv.config();

const forgetPassword = async (req, res) => {
  try {
    // Extract email from request body
    const { email } = req.body;

    // Step 1: Validate email presence
    if (!email) {
      return res.status(400).json({ message: "Email address is required." });
    }

    // Step 2: Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No account associated with this email address." });
    }

    // Step 3: Generate a secure token
    const secretToken = user._id.toString() + process.env.JWT_ACCESS_KEY;
    const token = jwt.sign({ _id: user._id }, secretToken, {
      expiresIn: "15m", // Token validity period
    });

    // Send password reset email
    await emailForget(email, token, user._id, user.name);

    return res.status(200).json({ message: "Password reset instructions have been sent to your email." });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return res.status(500).json({ message: "An error occurred while processing your request. Please try again later." });
  }
};

export default forgetPassword;
