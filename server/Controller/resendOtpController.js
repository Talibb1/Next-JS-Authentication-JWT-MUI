import UserModel from "../Model/User.js";
import UserOtp from "../Model/UserOtp.js";
import { generateOtp, hashOtp, saveOtpToDatabase } from "../Utils/EmailSend/otpGenerate.js";
import { sendOtpEmail } from "../Utils/EmailSend/SendOtp/emailUtils.js";
import { SALT, PEPPER, } from "../constants/constants.js";


const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "failed",
        message: "Email is required.",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        status: "failed",
        message: "Email is already verified.",
      });
    }

    // Generate a new OTP
    const otp = generateOtp();
    const hashedOtp = await hashOtp(otp, Number(SALT), PEPPER);

    // Remove any existing OTP for this user
    await UserOtp.deleteMany({ userId: user._id });

    // Save the new OTP to the database
    await saveOtpToDatabase(UserOtp, user._id, hashedOtp);

    // Send OTP email
    await sendOtpEmail(email, otp, user.name);

    return res.status(200).json({
      status: "success",
      message: "OTP and verification token sent to email for verification.",
    });
  } catch (error) {
    console.error("Error during OTP resend:", error);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while processing your request. Please try again later.",
    });
  }
};

export default resendOtp;