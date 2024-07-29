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

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();
    const hashedOtp = await hashOtp(otp, saltRounds, pepper);

    await saveOtpToDatabase(UserOtp, user._id, hashedOtp);
    await sendOtpEmail(email, otp, user.name);

    return res.status(200).json({ message: "OTP resent to email." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "failed", message: "Something went wrong" });
  }
};

export default ResendOtp;
