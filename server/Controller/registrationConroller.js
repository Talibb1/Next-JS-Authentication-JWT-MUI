import bcrypt from "bcrypt";
import UserModel from "../Model/User.js";
import { SALT, PEPPER } from "../constants/constants.js";

const saltRounds = Number(SALT);
const pepper = PEPPER;

const RegisterUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Step 1: Validate all required fields are provided
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      status: "failed",
      message: "All fields are required.",
    });
  }

  try {
    // Step 2: Check if the email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "failed",
        message: "Email already exists.",
      });
    }

    // Step 3: Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "failed",
        message: "Passwords do not match.",
      });
    }

    // Step 4: Hash the password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password + pepper, salt);

    // Step 5: Create new user and save to database
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // // Step 6: Generate JWT token for authentication
    // const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_ACCESS_KEY, {
    //   expiresIn: '1h'
    // });

    // // Step 7: Set token in HTTP-only cookie
    // res.cookie('authToken', token, {
    //   httpOnly: true,
    //   secure:  true,  // process.env.NODE_ENV === 'production', // Set secure flag only in production
    //   sameSite: 'strict',
    //   maxAge: 60 * 60 * 1000 // 1 hour
    // });

    // Step 8: Return success response
    return res.status(201).json({
      status: "success",
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      status: "failed",
      message:
        "An error occurred while processing your request. Please try again later.",
    });
  }
};

export default RegisterUser;
