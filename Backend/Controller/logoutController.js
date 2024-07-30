import RefreshToken from "../Model/RefreshToken.js";

const logoutController = async (req, res) => {
  try {
    // Extract the refresh token from the cookies
    const refreshToken = req.cookies.refreshToken;

    // Validate presence of refresh token
    if (!refreshToken) {
      return res.status(400).json({
        status: "failed",
        message: "Refresh token is missing",
      });
    }

    // Mark the refresh token as blacklisted and delete it from the database
    const token = await RefreshToken.findOneAndUpdate(
      { token: refreshToken },
      { blacklisted: true },
      { new: true }
    );

    if (!token) {
      return res.status(404).json({
        status: "failed",
        message: "Refresh token not found",
      });
    }

    await RefreshToken.deleteOne({ token: refreshToken });

    // Clear the cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("is_verified");

    // Send success response
    return res.status(200).json({
      status: "success",
      message: "Successfully logged out",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while processing your request. Please try again later.",
    });
  }
};

export default logoutController;
