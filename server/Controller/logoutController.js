import RefreshToken from "../Model/RefreshToken.js";
import UserModel from "../Model/User.js";

const logoutController = async (req, res) => {
  try {
    // Extract the refresh token from the cookies
    const refreshToken = req.cookies.refreshToken;

    // Validate the presence of the refresh token
    if (!refreshToken) {
      return res.status(400).json({
        status: "failed",
        message: "Refresh token is missing",
      });
    }

    // Find the refresh token in the database
    const tokenRecord = await RefreshToken.findOne({ token: refreshToken });

    if (!tokenRecord) {
      return res.status(404).json({
        status: "failed",
        message: "Refresh token not found",
      });
    }

    // Blacklist the refresh token
    tokenRecord.blacklisted = true;
    await tokenRecord.save();

    // Update the user's isAuth field to false
    await UserModel.findByIdAndUpdate(tokenRecord.userId, { isAuth: false });

    // Delete the refresh token from the database
    await RefreshToken.deleteOne({ token: refreshToken });

    // Clear the cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("isAuth");
    
    // Send success response
    return res.status(200).json({
      status: "success",
      message: "Successfully logged out",
    });
  } catch (error) {
    // Log the error and send a generic response to avoid exposing sensitive information
    console.error("Error during logout:", error);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while processing your request. Please try again later.",
    });
  }
};

export default logoutController;
