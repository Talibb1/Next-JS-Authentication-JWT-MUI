import UserModel from "../Model/User.js";
import UserOtp from "../Model/UserOtp.js";
import RefreshToken from "../Model/RefreshToken.js";

const CancelRegistration = async (req, res) => {
  const { email } = req.body;

  // Step 1: Validate email is provided
  if (!email) {
    return res.status(400).json({
      status: "failed",
      message: "Email is required."
    });
  }

  try {
    // Step 2: Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found."
      });
    }

    // Step 3: Delete the refresh token associated with the user
    const refreshTokenDeleteResult = await RefreshToken.findOneAndDelete({ user: user._id });

    // Step 4: Delete the OTP associated with the user
    const otpDeleteResult = await UserOtp.findOneAndDelete({ userId: user._id });

    // Step 5: Check if any document was actually deleted
    if (!refreshTokenDeleteResult && !otpDeleteResult) {
      return res.status(404).json({
        status: "failed",
        message: "No associated tokens or OTPs found for the user."
      });
    }

    // Step 6: Return success response
    return res.status(200).json({
      status: "success",
      message: "User registration canceled."
    });
  } catch (error) {
    console.error("Error during token deletion:", error);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while processing your request. Please try again later."
    });
  }
};

export default CancelRegistration;
