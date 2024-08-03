import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../Model/User.js";
import dotenv from "dotenv";
import generateTokens from "../Utils/GenerateToken/generateToken.js";
import setTokenCookies from "../Utils/GenerateToken/setTokenCookies.js";
import RefreshToken from "../Model/RefreshToken.js";
import {
  generateOtp,
  hashOtp,
  saveOtpToDatabase,
} from "../Utils/EmailSend/otpGenerate.js";
import { sendOtpEmail } from "../Utils/EmailSend/SendOtp/emailUtils.js";
import UserOtp from "../Model/UserOtp.js";

dotenv.config();

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Email and password are required.",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(
      password + process.env.PEPPER,
      user.password
    );
    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or password.",
      });
    }

    const blacklistedToken = await RefreshToken.findOne({
      user: user._id,
      blacklisted: true,
    });
    if (blacklistedToken) {
      return res.status(403).json({
        status: "failed",
        message: "User is blacklisted.",
      });
    }

    const { accessToken, refreshToken, refreshTokenExp, accessTokenExp } =
      await generateTokens(user);
    setTokenCookies(
      res,
      accessToken,
      refreshToken,
      refreshTokenExp,
      accessTokenExp
    );
    // Update user's authentication status to true
    user.is_auth = true;
    await user.save();

    if (!user.is_verified) {
      const otp = generateOtp();
      const hashedOtp = await hashOtp(
        otp,
        Number(process.env.SALT),
        process.env.PEPPER
      );
      const token = jwt.sign({ email }, process.env.JWT_ACCESS_KEY, {
        expiresIn: "1h",
      }); // JWT token with 1 hour expiration

      await saveOtpToDatabase(UserOtp, user._id, hashedOtp, token);
      await sendOtpEmail(email, otp, user.name);

      return res.status(200).json({
        status: "success",
        message:
          "Login successful. OTP and verification token sent to email for verification.",
        token,
        email,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          roles: user.roles[0],
          is_auth: user.is_auth, // Set is_auth to true
          is_verified: user.is_verified,
        },
        access_Token: accessToken,
        refresh_Token: refreshToken,
        access_Token_Expiration: accessTokenExp,
        refresh_Token_Expiration: refreshTokenExp,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Login successful. Redirecting to home page.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        roles: user.roles[0],
        is_auth: user.is_auth, // Set is_auth to true
        is_verified: user.is_verified,
      },
      access_Token: accessToken,
      refresh_Token: refreshToken,
      access_Token_Expiration: accessTokenExp,
      refresh_Token_Expiration: refreshTokenExp,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      status: "failed",
      message:
        "An error occurred while processing your request. Please try again later.",
    });
  }
};

export default userLogin;
