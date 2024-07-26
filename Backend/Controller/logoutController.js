import RefreshToken from "../Model/RefreshToken.js";

const logoutController = async (req, res) => {
  try {
    // Extract the refresh token from the cookies
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is missing" });
    }

    // Mark the refresh token as blacklisted and delete it from the database
    await RefreshToken.findOneAndUpdate(
      { token: refreshToken },
      { blacklisted: true }, // Mark the token as blacklisted
      { new: true }
    );

    await RefreshToken.deleteOne({ token: refreshToken });

    // Clear the cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("is_verified");

    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default logoutController;
