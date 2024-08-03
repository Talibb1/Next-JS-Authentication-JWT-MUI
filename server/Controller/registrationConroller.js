import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import UserModel from "../Model/User.js";

const saltRounds = Number(process.env.SALT);
const pepper = process.env.PEPPER;

const RegisterUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Step 1: Validate all required fields are provided
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      status: "failed",
      message: "All fields are required."
    });
  }

  try {
    // Step 2: Check if the email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "failed",
        message: "Email already exists."
      });
    }

    // Step 3: Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "failed",
        message: "Passwords do not match."
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
      message: "User registered successfully."
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while processing your request. Please try again later."
    });
  }
};

export default RegisterUser;










// import dotenv from "dotenv";
// dotenv.config();
// import bcrypt from "bcrypt";
// import jwt from 'jsonwebtoken';
// import UserModel from "../Model/User.js";
// import UserOtp from "../Model/UserOtp.js";
// import { generateOtp, hashOtp, saveOtpToDatabase } from "../Utils/EmailSend/otpGenerate.js";
// import { sendOtpEmail } from "../Utils/EmailSend/SendOtp/emailUtils.js";

// const saltRounds = Number(process.env.SALT);
// const pepper = process.env.PEPPER;

// const RegisterUser = async (req, res) => {
//   const { name, email, password, confirmPassword } = req.body;

//   // Step 1: Validate all required fields are provided
//   if (!name || !email || !password || !confirmPassword) {
//     return res.status(400).json({
//       status: "failed",
//       message: "All fields are required."
//     });
//   }

//   try {
//     // Step 2: Check if the email already exists
//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         status: "failed",
//         message: "Email already exists."
//       });
//     }

//     // Step 3: Check if passwords match
//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         status: "failed",
//         message: "Passwords do not match."
//       });
//     }

//     // Step 4: Hash the password
//     const salt = await bcrypt.genSalt(saltRounds);
//     const hashedPassword = await bcrypt.hash(password + pepper, salt);

//     // Step 5: Generate OTP and hash it
//     const otp = generateOtp();
//     const hashedOtp = await hashOtp(otp, saltRounds, pepper);

//     // Step 6: Create new user and save to database
//     const newUser = new UserModel({
//       name,
//       email,
//       password: hashedPassword,
//     });
//     await newUser.save();

//     // Step 7: Save OTP to database and send OTP email
//     await saveOtpToDatabase(UserOtp, newUser._id, hashedOtp);
//     await sendOtpEmail(email, otp, name);

//     // Step 8: Generate JWT token for email verification
//     const emailToken = jwt.sign({ email: newUser.email }, process.env.JWT_ACCESS_KEY, {
//       expiresIn: '10m'
//     });
//     res.cookie('emailToken', emailToken, {
//       httpOnly: true,
//       secure: true,
//       maxAge: 10 * 60 * 1000
//     });

//     // Step 9: Return success response
//     return res.status(201).json({
//       status: "success",
//       message: "User registered successfully. OTP sent to email."
//     });
//   } catch (error) {
//     console.error("Error during registration:", error);
//     return res.status(500).json({
//       status: "failed",
//       message: "An error occurred while processing your request. Please try again later."
//     });
//   }
// };

// export default RegisterUser;
