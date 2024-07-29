import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import UserModel from "../Model/User.js";
import UserOtp from "../Model/UserOtp.js";
import { generateOtp, hashOtp, saveOtpToDatabase } from "../Utils/EmailSend/otpGenerate.js";
import { sendOtpEmail } from "../Utils/EmailSend/SendOtp/emailUtils.js";

const saltRounds = Number(process.env.SALT);
const pepper = process.env.PEPPER;

const RegisterUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email Already Exists" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password + pepper, salt);

    const otp = generateOtp();
    const hashedOtp = await hashOtp(otp, saltRounds, pepper);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    await saveOtpToDatabase(UserOtp, newUser._id, hashedOtp);
    await sendOtpEmail(email, otp, name);

    // Generate JWT token for email
    const emailToken = jwt.sign({ email: newUser.email }, process.env.JWT_ACCESS_KEY, {
      expiresIn: '10m'
    });
    res.cookie('emailToken', emailToken, {
      httpOnly: true,
      secure: true,
      maxAge: 10 * 60 * 1000
    });

    return res.status(201).json({ message: "User registered successfully. OTP sent to email." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "failed", message: "Something went wrong" });
  }
};

export default RegisterUser;