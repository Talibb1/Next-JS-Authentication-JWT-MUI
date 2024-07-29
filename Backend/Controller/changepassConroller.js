import bcrypt from "bcrypt";
import UserModel from "../Model/User.js";
import dotenv from "dotenv";
dotenv.config();

// Constants for salt rounds and pepper
const saltRounds = Number(process.env.SALT);
const pepper = process.env.PEPPER;

const changeUserPassword = async (req, res) => {
  try {
    // Extract current password, new password, and confirm password from request body
    const { currentPassword, newPassword, newPasswordConfirmation } = req.body;

    // Check if all fields are provided
    if (!currentPassword || !newPassword || !newPasswordConfirmation) {
      return res.status(400).json({
        status: "failed",
        message: "All fields are required",
      });
    }

    // Check if new password and confirmation password match
    if (newPassword !== newPasswordConfirmation) {
      return res.status(400).json({
        status: "failed",
        message: "New password and confirmation do not match",
      });
    }

    // Fetch the user's current hashed password from the database
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(
      currentPassword + pepper,
      user.password
    );
    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Current password is incorrect",
      });
    }

    // Generate a new salt and hash the new password with the salt and pepper
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedNewPassword = await bcrypt.hash(newPassword + pepper, salt);

    // Update the user's password in the database using the new hashed password
    await UserModel.findByIdAndUpdate(req.user._id, {
      password: hashedNewPassword,
    });

    // Return success message if password is changed successfully
    return res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);  // Log the error for debugging
    return res.status(500).json({
      status: "failed",
      message: "An internal server error occurred. Please try again later.",
    });
  }
};

export default changeUserPassword;
