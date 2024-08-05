import jwt from "jsonwebtoken";
import RefreshToken from "../../Model/RefreshToken.js";
import { JWT_REFRESH_KEY, JWT_ACCESS_KEY } from "../../constants/constants.js";

const generateTokens = async (user) => {
  try {
    const payload = { _id: user._id, roles: user.roles };

    // Generate access token with expiration time
    const accessTokenExp = Math.floor(Date.now() / 1000) + 100; // Set expiration to 100 seconds from now
    const accessToken = jwt.sign(
      { ...payload, exp: accessTokenExp },
      JWT_ACCESS_KEY
    );

    // Generate refresh token with expiration time
    const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5; // Set expiration to 5 days from now
    const refreshToken = jwt.sign(
      { ...payload, exp: refreshTokenExp },
      JWT_REFRESH_KEY
    );

    // Check and delete existing refresh token
    const userRefreshToken = await RefreshToken.findOneAndDelete({
      userId: user._id,
    });

    // Save new refresh token
    await new RefreshToken({ userId: user._id, token: refreshToken }).save();

    return { accessToken, refreshToken, accessTokenExp, refreshTokenExp };
  } catch (error) {
    console.error("Failed to generate tokens:", error);
    throw new Error("Failed to generate tokens");
  }
};

export default generateTokens;
