import UserModel from "../Model/User.js";
import UserOtp from "../Model/UserOtp.js";

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

    // Step 4: Check if OTP exists and delete it if found
    const otpRecord = await UserOtp.findOne({ userId: user._id });
    if (otpRecord) {
      await UserOtp.deleteOne({ userId: user._id });
    }

    // Step 5: Return success response
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
