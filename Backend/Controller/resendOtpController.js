import dotenv from "dotenv";
dotenv.config();
import UserModel from "../Model/User.js";
import UserOtp from "../Model/UserOtp.js";
import { generateOtp, hashOtp, saveOtpToDatabase } from "../Utils/EmailSend/otpGenerate.js";
import { sendOtpEmail } from "../Utils/EmailSend/SendOtp/emailUtils.js";

const saltRounds = Number(process.env.SALT);
const pepper = process.env.PEPPER;

const ResendOtp = async (req, res) => {
  const { email } = req.body;

  // Step 1: Validate email is provided
  if (!email) {
    return res.status(400).json({
      status: "failed",
      message: "Email is required."
    });
  }

  try {
    // Step 2: Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found."
      });
    }

    // Step 3: Generate a new OTP and hash it
    const otp = generateOtp();
    const hashedOtp = await hashOtp(otp, saltRounds, pepper);

    // Step 4: Save the hashed OTP to the database
    await saveOtpToDatabase(UserOtp, user._id, hashedOtp);

    // Step 5: Send the OTP to the user's email
    await sendOtpEmail(email, otp, user.name);

    // Step 6: Return success response
    return res.status(200).json({
      status: "success",
      message: "OTP resent to email."
    });
  } catch (error) {
    console.error("Error during OTP resend:", error);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while processing your request. Please try again later."
    });
  }
};

export default ResendOtp;
