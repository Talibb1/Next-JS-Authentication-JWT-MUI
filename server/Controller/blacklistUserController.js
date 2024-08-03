import RefreshToken from "../Model/RefreshToken.js";

const blacklistUser = async (req, res) => {
  const { userId } = req.body;

  // Validate input
  if (!userId) {
    return res.status(400).json({
      status: "failed",
      message: "User ID is required",
    });
  }

  try {
    // Update tokens to be blacklisted
    const result = await RefreshToken.updateMany({ user: userId }, { blacklisted: true });

    // Check if any documents were modified
    if (result.modifiedCount === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No tokens found to blacklist for the specified user",
      });
    }

    // Respond with success message
    res.status(200).json({
      status: "success",
      message: "User has been blacklisted successfully",
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (err) {
    // Log the error for debugging
    console.error("Error blacklisting user:", err);    // Log the error for debugging

    // Respond with a generic error message
    res.status(500).json({
      status: "failed",
      message: "An internal server error occurred. Please try again later.",
    });
  }
};

export default blacklistUser;
