import bcrypt from "bcrypt";
import UserPasswordModel from "../Model/UserPassword.js";
import { SALT, PEPPER } from "../constants/constants.js";

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

    // Fetch the user's password document from the database using userId
    const userPasswordDoc = await UserPasswordModel.findOne({ userId: req._id });

    if (!userPasswordDoc) {
      return res.status(404).json({
        status: "failed",
        message: "User password information not found",
      });
    }

    // Verify the current password
    const isMatch = bcrypt.compare(
      currentPassword + PEPPER,
      userPasswordDoc.password
    );
    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Current password is incorrect",
      });
    }

    // Generate a new salt and hash the new password with the salt and PEPPER
    const salt = await bcrypt.genSalt(Number(SALT));
    const hashedNewPassword = await bcrypt.hash(newPassword + PEPPER, salt);

    // Add the old password to the oldPasswords array and update the password
    userPasswordDoc.oldPasswords.push({
      password: userPasswordDoc.password,
      changedAt: userPasswordDoc.passwordChangedAt,
    });
    userPasswordDoc.password = hashedNewPassword;
    userPasswordDoc.passwordChangedAt = Date.now();

    // Save the updated document
    await userPasswordDoc.save();

    // Return success message if password is changed successfully
    return res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error); // Log the error for debugging
    return res.status(500).json({
      status: "failed",
      message: "An internal server error occurred. Please try again later.",
    });
  }
};

export default changeUserPassword;
