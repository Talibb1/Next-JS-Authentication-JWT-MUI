import UserModel from "../Model/User.js";
import UserPasswordModel from "../Model/UserPassword.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SALT, PEPPER, JWT_ACCESS_KEY } from "../constants/constants.js";

const passwordResetController = async (req, res) => {
  try {
    const { _id, token, Password, ConfirmPassword } = req.body;

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
        message: "Passwords do not match",
      });
    }

    // Validate _id
    if (!_id || !token) {
      return res.status(400).json({
        status: "failed",
        message: "User ID and Token are required",
      });
    }

    // Find user by ID
    const user = await UserModel.findById(_id);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    // Verify token
    const new_secret = user._id.toString() + JWT_ACCESS_KEY;
    jwt.verify(token, new_secret);

    // Hash the new password
    const salt = await bcrypt.genSalt(Number(SALT));
    const hashedPassword = await bcrypt.hash(Password + PEPPER, salt);

    // Find the user's password entry in the UserPasswordModel
    let userPassword = await UserPasswordModel.findOne({ userId: user._id });

    if (!userPassword) {
      return res.status(404).json({
        status: "failed",
        message: "Password not found, Please request a new one",
      });
    } else {
      // Update the existing password entry
      userPassword.password = hashedPassword;
      await userPassword.save(); 
    }

    return res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "failed",
        message: "Your session has expired, Please request a new one.",
      });
    }
    console.error("Error resetting password:", error);
    return res.status(500).json({
      status: "failed",
      message: "Error resetting password. Please try again later.",
    });
  }
};


export default passwordResetController;
