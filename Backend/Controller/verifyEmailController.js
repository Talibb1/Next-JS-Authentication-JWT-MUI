import bcrypt from "bcrypt";
import UserModel from "../Model/User.js";
import UserOtp from "../Model/UserOtp.js";
import { sendCongratulationEmail } from "../Utils/EmailSend/SendCongratulation/congratulationEmail.js";

const VerifyEmail = async (req, res) => {
  try {
    const { email, otp, token } = req.body;

    // Step 1: Validate input fields
    if (!email || !otp || !token) {
      return res.status(400).json({
        status: "failed",
        message: "Email, OTP, and token are required."
      });
    }

    // Step 2: Check if the user exists
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        status: "failed",
        message: "User not found."
      });
    }

    // Step 3: Check if the email is already verified
    if (existingUser.is_verified) {
      return res.status(400).json({
        status: "failed",
        message: "Email is already verified."
      });
    }

    // Step 4: Check if the OTP exists
    const emailVerified = await UserOtp.findOne({ userId: existingUser._id });
    if (!emailVerified) {
      return res.status(404).json({
        status: "failed",
        message: "OTP not found."
      });
    }

    // Step 5: Verify OTP
    const isOtpMatch = await bcrypt.compare(otp + process.env.PEPPER, emailVerified.otp);
    if (!isOtpMatch) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid OTP."
      });
    }

    // Step 6: Verify token
    const isTokenMatch = await bcrypt.compare(token + process.env.PEPPER, emailVerified.token);
    if (!isTokenMatch) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid token."
      });
    }

    // Step 7: Check OTP and token expiration
    const currentTime = new Date();
    if (currentTime > emailVerified.otpExpiry) {
      await emailVerified.remove();
      return res.status(400).json({
        status: "failed",
        message: "OTP expired, please request a new one."
      });
    }

    if (currentTime > emailVerified.tokenExpiry) {
      await emailVerified.remove();
      return res.status(400).json({
        status: "failed",
        message: "Token expired, please request a new one."
      });
    }

    // Step 8: Update user's verification status
    existingUser.is_verified = true;
    await existingUser.save();

    // Step 9: Remove used OTP and token from the database
    await UserOtp.deleteMany({ userId: existingUser._id });

    // Step 10: Send congratulatory email
    await sendCongratulationEmail(existingUser.email, existingUser.name);

    // Step 11: Return success response
    return res.status(200).json({
      status: "success",
      message: "Email verified successfully."
    });
  } catch (error) {
    console.error("Error during email verification:", error);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while processing your request. Please try again later."
    });
  }
};

export default VerifyEmail;
