import jwt from "jsonwebtoken";
import RefreshToken from "../../Model/RefreshToken.js";

// Function to generate access token
const generateAccessToken = (user) => {
  const payload = { _id: user._id, roles: user.roles };
  const accessTokenExp = Math.floor(Date.now() / 1000) + 100; // Expires in 100 seconds

  return jwt.sign(
    { ...payload, exp: accessTokenExp },
    process.env.JWT_ACCESS_KEY,
    { algorithm: "HS256" }
  );
};

// Function to generate refresh token
const generateRefreshToken = (user) => {
  const payload = { _id: user._id, roles: user.roles };
  const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5; // Expires in 5 days

  return jwt.sign(
    { ...payload, exp: refreshTokenExp },
    process.env.JWT_REFRESH_KEY,
    { algorithm: "HS256" }
  );
};

// Main function to generate tokens
const generateTokens = async (user) => {
  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5;
    const accessTokenExp = Math.floor(Date.now() / 1000) + 100; // Expires in 100 seconds

    // Check and delete existing refresh token
    const userRefreshToken = await RefreshToken.findOneAndDelete({ user: user._id });
    if (userRefreshToken) {
      // console.log(`Deleted old refresh token for user: ${user._id}`);
    }
// Black list the user refreshtoken
// if (userRefreshToken){
//    userRefreshToken.blacklisted = true;
//    await userRefreshToken.save();
// }
    // Save new refresh token
    await new RefreshToken({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(refreshTokenExp * 1000),
    }).save();

    return { accessToken, refreshToken, refreshTokenExp, accessTokenExp };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate tokens");
  }
};

export default generateTokens;










// const userRefreshToken = await RefreshToken.findOne({ userId: user._id });
// if (userRefreshToken) await userRefreshToken.remove();
// const userRefreshToken = await RefreshToken.findOneAndDelete({ userId: user._id });

