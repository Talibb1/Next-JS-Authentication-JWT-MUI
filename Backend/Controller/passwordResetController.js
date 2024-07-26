import UserModel from "../Model/User.js";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Constants for salt rounds and pepper
const saltRounds = process.env.SALT;
const pepper = process.env.PEPPER;

const passwordResetController = async (req, res) => {
  try {
    const { Password, ConfirmPassword } = req.body;
    const { id, token } = req.params;
    if (!Password || !ConfirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password are required" });
    }
    if (Password !== ConfirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match" });
    }
    // Validate password strength
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!passwordRegex.test(Password)) {
    //  return res.status(400).json({message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'});
    // }
    const user = await UserModel.findByIdAndUpdate(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const new_secret = user._id.toString() + process.env.JWT_ACCESS_KEY;
    jwt.verify(token, new_secret);
    // Hash the password
    const salt = await bcrypt.genSalt(Number(saltRounds));
    const hashedPassword = await bcrypt.hash(Password + pepper, salt);
    await UserModel.findByIdAndUpdate(user._id, {
      $set: { password: hashedPassword },
    });
    // Update the user's password in the database
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token has expired. Please request a new one." });
    }
    res.status(500).json({ message: "Error resetting password" });
  }
};

export default passwordResetController;
