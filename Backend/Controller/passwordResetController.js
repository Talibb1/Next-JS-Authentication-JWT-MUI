import UserModel from "../Model/User.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

// Constants for salt rounds and pepper
const saltRounds = process.env.SALT;
const pepper = process.env.PEPPER;

const passwordResetController = async (req, res) => {
  try {
    const { Password, ConfirmPassword } = req.body;
    const { id, token } = req.params;

    // Validate password and confirmation
    if (!Password || !ConfirmPassword) {
      return res.status(400).json({
        status: "failed",
        message: "Password and Confirm Password are required",
      });
    }

    if (Password !== ConfirmPassword) {
      return res.status(400).json({
        status: "failed",
        message: "Password and Confirm Password do not match",
      });
    }

    // Find user by ID
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    // Verify token
    const new_secret = user._id.toString() + process.env.JWT_ACCESS_KEY;
    jwt.verify(token, new_secret);

    // Hash the new password
    const salt = await bcrypt.genSalt(Number(saltRounds));
    const hashedPassword = await bcrypt.hash(Password + pepper, salt);

    // Update the user's password in the database
    await UserModel.findByIdAndUpdate(user._id, {
      $set: { password: hashedPassword },
    });

    return res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "failed",
        message: "Token has expired. Please request a new one.",
      });
    }

    console.error("Error resetting password:", error); // Log the error
    return res.status(500).json({
      status: "failed",
      message: "Error resetting password. Please try again later.",
    });
  }
};

export default passwordResetController;
