import jwt from "jsonwebtoken";
import RefreshToken from "../../Model/RefreshToken.js";
import { JWT_REFRESH_KEY } from "../../constants/constants.js";

const verifyRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }
  try {
    // Find the refresh token document
    const userRefreshToken = await RefreshToken.findOne({
      token: refreshToken,
    });

    // If refresh token not found, throw an error
    if (!userRefreshToken) {
      throw new Error("Invalid refresh token");
    }

    // Verify the refresh token
    const tokenDetails = jwt.verify(refreshToken, JWT_REFRESH_KEY);

    // Return token details if verification is successful
    return {
      tokenDetails,
      error: false,
      message: "Valid refresh token",
    };
  } catch (error) {
    // Handle errors appropriately and provide meaningful messages
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid refresh token");
    }
    if (error.name === "TokenExpiredError") {
      throw new Error("Refresh token expired");
    }
    // Generic error handling
    throw new Error("Failed to verify refresh token");
  }
};

export default verifyRefreshToken;
