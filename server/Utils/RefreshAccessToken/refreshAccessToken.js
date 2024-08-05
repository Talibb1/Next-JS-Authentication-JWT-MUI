import UserModel from "../../Model/User.js";
import UserRefreshTokenModel from "../../Model/RefreshToken.js";
import generateTokens from "../GenerateToken/generateToken.js";
import verifyRefreshToken from "./verifyRefreshToken.js";

const refreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      return res
        .status(400)
        .send({ status: "failed", message: "Refresh token not provided" });
    }

    // Verify Refresh Token
    const { tokenDetails } = await verifyRefreshToken(oldRefreshToken);

    // Find User based on Refresh Token detail id
    const user = await UserModel.findById(tokenDetails._id);
    if (!user) {
      return res
        .status(404)
        .send({ status: "failed", message: "User not found" });
    }

    const userRefreshToken = await UserRefreshTokenModel.findOne({
      userId: tokenDetails._id,
    });
    if (
      !userRefreshToken ||
      oldRefreshToken !== userRefreshToken.token ||
      userRefreshToken.blacklisted
    ) {
      return res
        .status(401)
        .send({ status: "failed", message: "Unauthorized access" });
    }

    // Generate new access and refresh tokens
    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      await generateTokens(user);
    // Set the new tokens in cookies
    return {
      newAccessToken: accessToken,
      newRefreshToken: refreshToken,
      newAccessTokenExp: accessTokenExp,
      newRefreshTokenExp: refreshTokenExp,
    };
  } catch (error) {
    // Provide meaningful error messages based on the error type
    if (
      error.message === "Invalid refresh token" ||
      error.message === "Unauthorized access"
    ) {
      return res.status(401).send({ status: "failed", message: error.message });
    }
    return res
      .status(500)
      .send({ status: "failed", message: "Internal server error" });
  }
};

export default refreshAccessToken;
