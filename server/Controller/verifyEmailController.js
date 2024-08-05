import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../Model/User.js";
import UserOtp from "../Model/UserOtp.js";
import { sendCongratulationEmail } from "../Utils/EmailSend/SendCongratulation/congratulationEmail.js";
import { JWT_ACCESS_KEY, PEPPER } from "../constants/constants.js";

const VerifyEmail = async (req, res) => {
  try {
    const { email, otp, token } = req.body;

    if (!email || !otp || !token) {
      return res.status(400).json({
        status: "failed",
        message: "Email, OTP, and token are required.",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
    }

    if (existingUser.is_verified) {
      return res.status(400).json({
        status: "failed",
        message: "Email is already verified.",
      });
    }

    const emailVerified = await UserOtp.findOne({ userId: existingUser._id });
    if (!emailVerified) {
      return res.status(404).json({
        status: "failed",
        message: "OTP expired, please request a new one.",
      });
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, JWT_ACCESS_KEY);
      // Ensure token matches email and otp
      if (decoded.email !== email) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid token data.",
        });
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          status: "failed",
          message: "Token expired, please request a new one.",
        });
      } else {
        return res.status(400).json({
          status: "failed",
          message: "Invalid token.",
        });
      }
    }

    // Verify the OTP
    const isOtpMatch = await bcrypt.compare(otp + PEPPER, emailVerified.otp);
    if (!isOtpMatch) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid OTP, Please try again.",
      });
    }

    // Check OTP expiration
    const currentTime = new Date();
    if (currentTime > emailVerified.otpExpiry) {
      await UserOtp.deleteOne({ _id: emailVerified._id });
      return res.status(400).json({
        status: "failed",
        message: "OTP expired, please request a new one.",
      });
    }

    // Update user's verification status
    existingUser.is_verified = true;
    existingUser.is_auth = true;
    await existingUser.save();

    // Remove used OTP from the database
    await UserOtp.deleteMany({ userId: existingUser._id });

    // Send congratulatory email
    await sendCongratulationEmail(existingUser.email, existingUser.name);

    // Return success response
    return res.status(200).json({
      status: "success",
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("Error during email verification:", error);
    return res.status(500).json({
      status: "failed",
      message:
        "An error occurred while processing your request. Please try again later.",
    });
  }
};

export default VerifyEmail;
