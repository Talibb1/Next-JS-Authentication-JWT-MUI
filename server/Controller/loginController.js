import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../Model/User.js";
import UserPasswordModel from "../Model/UserPassword.js"; // Import UserPasswordModel
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
import { SALT, PEPPER, JWT_ACCESS_KEY } from "../constants/constants.js";

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Email and password are required.",
      });
    }

    // Fetch user information
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid email or password.",
      });
    }

    // Fetch user password from UserPassword model
    const userPasswordDoc = await UserPasswordModel.findOne({ userId: user._id });
    if (!userPasswordDoc) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid email or password.",
      });
    }

    const isMatch = bcrypt.compare(password + PEPPER, userPasswordDoc.password);
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
      message: "User is blacklisted. Login denied.",
      });
    }

    // Generate tokens
    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      await generateTokens(user);

    // Set Cookies
    setTokenCookies(
      res,
      accessToken,
      refreshToken,
      accessTokenExp,
      refreshTokenExp
    );

    // Handle user verification
    if (!user.isVerified) {
      const otp = generateOtp();
      const hashedOtp = await hashOtp(otp, Number(SALT), PEPPER);
      const token = jwt.sign({ email }, JWT_ACCESS_KEY, {
        expiresIn: "1m",
      }); // JWT token with 1 minute expiration
      await saveOtpToDatabase(UserOtp, user._id, hashedOtp, token);
      await sendOtpEmail(email, otp, user.name);

      return res.status(200).json({
        status: "success",
        message: "OTP sent to your email.",
        user: {
          token,
          id: user._id,
          email: user.email,
          name: user.name,
          roles: user.roles[0],
          isAuth: user.isAuth,
          isVerified: user.isVerified,
        },
        access_Token: accessToken,
        refresh_Token: refreshToken,
        access_Token_Expiration: accessTokenExp,
        refresh_Token_Expiration: refreshTokenExp,
      });
    }
    
    // Update user's authentication status to true
    user.isAuth = true;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Login successful.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        roles: user.roles[0],
        isAuth: user.isAuth,
        isVerified: user.isVerified,
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
