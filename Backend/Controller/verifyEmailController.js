import bcrypt from "bcrypt";
import UserModel from "../Model/User.js";
import UserOtp from "../Model/UserOtp.js";
import { sendCongratulationEmail } from "../Utils/EmailSend/SendCongratulation/congratulationEmail.js";

// Function to verify email using OTP
const VerifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Email doesn't exist" });
    }

    if (existingUser.is_varified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const emailVarified = await UserOtp.findOne({ userId: existingUser._id });
    if (!emailVarified) {
      return res.status(400).json({ message: "OTP not found" });
    }

    const isMatch = await bcrypt.compare(otp + process.env.PEPPER, emailVarified.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const currentTime = new Date();
    if (currentTime > emailVarified.otpExpiry) {
      await emailVarified.remove();
      return res.status(400).json({ message: "OTP expired, Please try again" });
    }

    existingUser.is_varified = true;
    await existingUser.save();

    await UserOtp.deleteMany({ userId: existingUser._id });

    // Send congratulatory email after successful verification
    await sendCongratulationEmail(existingUser.email, existingUser.name);

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "failed", message: "Something went wrong" });
  }
};

export default VerifyEmail;
