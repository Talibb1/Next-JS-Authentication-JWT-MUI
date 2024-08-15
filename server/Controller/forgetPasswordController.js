import UserModel from "../Model/User.js";
import UserPasswordModel from "../Model/UserPassword.js";
import jwt from "jsonwebtoken";
import { emailForget } from "../Utils/EmailSend/SendForgetPassword/emailForget.js";
import { JWT_ACCESS_KEY } from "../constants/constants.js";

const forgetPassword = async (req, res) => {
  try {
    // Extract email from request body
    const { email } = req.body;

    // Step 1: Validate email presence
    if (!email) {
      return res.status(400).json({
        status: "failed",
        message: "Email address is required.",
      });
    }

    // Step 2: Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No account associated with this email address.",
      });
    }

    // Step 3: Check if the user has a password in UserPasswordModel
    const userPassword = await UserPasswordModel.findOne({ userId: user._id });
    if (!userPassword || !userPassword.password) {
      return res.status(404).json({
        status: "failed",
        message: "No account associated with this email address.",
      });
    }

    // Step 4: Generate a secure token
    const secretToken = user._id.toString() + JWT_ACCESS_KEY;
    const token = jwt.sign({ _id: user._id }, secretToken, {
      expiresIn: "5m", // Token validity period
    });

    // Step 5: Send password reset email
    await emailForget(email, token, user._id, user.name);

    return res.status(200).json({
      status: "success",
      message: "Password reset instructions have been sent to your email.",
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return res.status(500).json({
      status: "failed",
      message:
        "An error occurred while processing your request. Please try again later.",
    });
  }
};

export default forgetPassword;
