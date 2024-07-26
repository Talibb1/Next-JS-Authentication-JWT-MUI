import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import sendEmail from "../Utils/EmailSend/sendEmail.js";
import UserModel from "../Model/User.js";

// Constants for salt rounds and pepper
const saltRounds = process.env.SALT;
const pepper = process.env.PEPPER;

const RegisterUser = async (req, res) => {
  // Extract name, email, password, and confirmPassword from request body
  const { name, email, password, confirmPassword } = req.body;

  // Step 1: Validate input data
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Step 2: Check if user already exists
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email Already Exists" });
    }

    // Step 3: Validate passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Step 4: Hash password and save user
    const salt = await bcrypt.genSalt(Number(saltRounds));
    const hashedPassword = await bcrypt.hash(password + pepper, salt);
    const document = new UserModel({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await document.save();

    // Step 6: sendEmail With OPT
    sendEmail(req, document);

    // Step 7: Respond with success message
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: "failed", message: "Something went wrong" });
  }
};

export default RegisterUser;
