import bcrypt from "bcrypt";
import UserModel from "../Model/User.js";
import dotenv from "dotenv";
import generateTokens from "../Utils/GenerateToken/generateToken.js";
import setTokenCookies from "../Utils/GenerateToken/setTokenCookies.js";
import RefreshToken from "../Model/RefreshToken.js";
dotenv.config();

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.is_varified) {
      return res.status(400).json({ message: "Your account is not verified" });
    }

    const isMatch = await bcrypt.compare(
      password + process.env.PEPPER,
      user.password
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the user's refresh token is blacklisted
    const blacklistedToken = await RefreshToken.findOne({ user: user._id, blacklisted: true });
    if (blacklistedToken) {
      return res.status(403).json({ message: "User is blacklisted" });
    }

    // Step 5: Generate JWT Token
    const { accessToken, refreshToken, refreshTokenExp, accessTokenExp } =
      await generateTokens(user);

    // Set Cookies
    setTokenCookies(
      res,
      accessToken,
      refreshToken,
      refreshTokenExp,
      accessTokenExp
    );

    // Send success response with JWT token
    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        roles: user.roles[0],
      },
      status: "success",
      message: "Login successful",
      access_Token: accessToken,
      refresh_Token: refreshToken,
      access_Token_Expiration: accessTokenExp,
      refresh_Token_Expiration: refreshTokenExp,
      is_auth: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to login" });
  }
};

export default userLogin;
