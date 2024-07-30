import bcrypt from 'bcrypt';
import UserModel from "../Model/User.js";
import dotenv from "dotenv";
import generateTokens from "../Utils/GenerateToken/generateToken.js";
import setTokenCookies from "../Utils/GenerateToken/setTokenCookies.js";
import RefreshToken from "../Model/RefreshToken.js";
import { generateOtp, hashOtp, saveOtpToDatabase, tokensGenerate } from "../Utils/EmailSend/otpGenerate.js";
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

    const isMatch = await bcrypt.compare(password + process.env.PEPPER, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or password.",
      });
    }

    const blacklistedToken = await RefreshToken.findOne({ user: user._id, blacklisted: true });
    if (blacklistedToken) {
      return res.status(403).json({
        status: "failed",
        message: "User is blacklisted.",
      });
    }

    const { accessToken, refreshToken, refreshTokenExp, accessTokenExp } = await generateTokens(user);
    setTokenCookies(res, accessToken, refreshToken, refreshTokenExp, accessTokenExp);

    if (!user.is_verified) {
      const otp = generateOtp();
      const hashedOtp = await hashOtp(otp, Number(process.env.SALT), process.env.PEPPER);
      const token = tokensGenerate();
      const hashedToken = await hashOtp(token, Number(process.env.SALT), process.env.PEPPER);

      await saveOtpToDatabase(UserOtp, user._id, hashedOtp, hashedToken);
      await sendOtpEmail(email, otp, user.name, token);

      return res.status(200).json({
        status: "success",
        message: "Login successful. OTP and verification token sent to email for verification.",
        token,
        email,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          roles: user.roles[0],
        },
        access_Token: accessToken,
        refresh_Token: refreshToken,
        access_Token_Expiration: accessTokenExp,
        refresh_Token_Expiration: refreshTokenExp,
        is_auth: true,
        requires_otp_verification: false,
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
      },
      access_Token: accessToken,
      refresh_Token: refreshToken,
      access_Token_Expiration: accessTokenExp,
      refresh_Token_Expiration: refreshTokenExp,
      is_auth: true,
      requires_otp_verification: true
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while processing your request. Please try again later.",
    });
  }
};

export default userLogin;





















// import bcrypt from "bcrypt";
// import UserModel from "../Model/User.js";
// import dotenv from "dotenv";
// import generateTokens from "../Utils/GenerateToken/generateToken.js";
// import setTokenCookies from "../Utils/GenerateToken/setTokenCookies.js";
// import RefreshToken from "../Model/RefreshToken.js";
// import { generateOtp, hashOtp, saveOtpToDatabase } from "../Utils/EmailSend/otpGenerate.js";
// import { sendOtpEmail } from "../Utils/EmailSend/SendOtp/emailUtils.js";
// import UserOtp from "../Model/UserOtp.js";

// dotenv.config();

// const userLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate email and password presence
//     if (!email || !password) {
//       return res.status(400).json({
//         status: "failed",
//         message: "Email and password are required.",
//       });
//     }

//     // Check if user exists
//     const user = await UserModel.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         status: "failed",
//         message: "User not found.",
//       });
//     }

//     // Validate password
//     const isMatch = await bcrypt.compare(password + process.env.PEPPER, user.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         status: "failed",
//         message: "Invalid email or password.",
//       });
//     }

//     // Check if the user's refresh token is blacklisted
//     const blacklistedToken = await RefreshToken.findOne({ user: user._id, blacklisted: true });
//     if (blacklistedToken) {
//       return res.status(403).json({
//         status: "failed",
//         message: "User is blacklisted.",
//       });
//     }

//     // Generate JWT tokens
//     const { accessToken, refreshToken, refreshTokenExp, accessTokenExp } = await generateTokens(user);

//     // Set token cookies
//     setTokenCookies(res, accessToken, refreshToken, refreshTokenExp, accessTokenExp);

//     // Generate and send OTP if the user is not verified
//     if (!user.is_verified) {
//       const otp = generateOtp();
//       const hashedOtp = await hashOtp(otp, Number(process.env.SALT), process.env.PEPPER);
//       await saveOtpToDatabase(UserOtp, user._id, hashedOtp);
//       await sendOtpEmail(email, otp, user.name);

//       return res.status(200).json({
//         status: "success",
//         message: "Login successful. OTP sent to email for verification.",
//         user: {
//           id: user._id,
//           email: user.email,
//           name: user.name,
//           roles: user.roles[0],
//         },
//         access_Token: accessToken,
//         refresh_Token: refreshToken,
//         access_Token_Expiration: accessTokenExp,
//         refresh_Token_Expiration: refreshTokenExp,
//         is_auth: true,
//         requires_otp_verification: true
//       });
//     }

//     // Send success response with user data and tokens if the user is verified
//     return res.status(200).json({
//       status: "success",
//       message: "Login successful. Redirecting to home page.",
//       user: {
//         id: user._id,
//         email: user.email,
//         name: user.name,
//         roles: user.roles[0],
//       },
//       access_Token: accessToken,
//       refresh_Token: refreshToken,
//       access_Token_Expiration: accessTokenExp,
//       refresh_Token_Expiration: refreshTokenExp,
//       is_auth: true,
//       requires_otp_verification: false
//     });
//   } catch (error) {
//     console.error("Error during login:", error); // Log the error for debugging
//     return res.status(500).json({
//       status: "failed",
//       message: "An error occurred while processing your request. Please try again later.",
//     });
//   }
// };

// export default userLogin;
