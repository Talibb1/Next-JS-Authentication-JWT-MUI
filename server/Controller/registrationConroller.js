import bcrypt from "bcrypt";
import UserModel from "../Model/User.js";
import { SALT, PEPPER } from "../constants/constants.js";
import UserPasswordModel from "../Model/UserPassword.js";

const RegisterUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Validate required fields
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      status: "failed",
      message: "All fields are required.",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      status: "failed",
      message: "Passwords do not match.",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      // If user already exists with local provider
      if (existingUser.authProvider.includes("local")) {
        return res.status(400).json({
          status: "failed",
          message: "Email already registered with a local account.",
        });
      }

      // Otherwise, proceed to add password for OAuth users
      const salt = await bcrypt.genSalt(Number(SALT));
      const hashedPassword = await bcrypt.hash(password + PEPPER, salt);

      // Save the new password in UserPasswordModel
      const userPassword = new UserPasswordModel({
        userId: existingUser._id,
        password: hashedPassword,
      });
      await userPassword.save();

      // Update the existing user to include 'local' in authProvider
      existingUser.authProvider.push("local");
      await existingUser.save();

      return res.status(200).json({
        status: "success",
        message: "Account updated with local credentials.",
      });
    } else {
      // Create a new user
      const salt = await bcrypt.genSalt(Number(SALT));
      const hashedPassword = await bcrypt.hash(password + PEPPER, salt);

      const newUser = new UserModel({
        name,
        email,
        authProvider: ["local"],
      });
      await newUser.save();

      // Save hashed password in UserPasswordModel
      const userPassword = new UserPasswordModel({
        userId: newUser._id,
        password: hashedPassword,
      });
      await userPassword.save();

      return res.status(201).json({
        status: "success",
        message: "User registered successfully.",
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Server error. Please try again later.",
    });
  }
};

export default RegisterUser;
