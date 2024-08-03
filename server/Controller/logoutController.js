import RefreshToken from "../Model/RefreshToken.js";
import UserModel from "../Model/User.js";


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

    // Delete the refresh token
    await RefreshToken.deleteOne({ token: refreshToken });

    // Update the user's is_auth field to false
    await UserModel.findByIdAndUpdate(tokenRecord.user, { is_auth: false });

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


// import RefreshToken from "../Model/RefreshToken.js";

// const logoutController = async (req, res) => {
//   try {
//     // Extract the refresh token from the cookies
//     const refreshToken = req.cookies.refreshToken;

//     // Validate presence of refresh token
//     if (!refreshToken) {
//       return res.status(400).json({
//         status: "failed",
//         message: "Refresh token is missing",
//       });
//     }


//     const token = await RefreshToken.findOneAndUpdate(
//       { token: refreshToken },
//       { blacklisted: true },
//       // { new: true }
//     );

//     if (!token) {
//       return res.status(404).json({
//         status: "failed",
//         message: "Refresh token not found",
//       });
//     }

//     await RefreshToken.deleteOne({ token: refreshToken });

//     // Clear the cookies
//     res.clearCookie("accessToken");
//     res.clearCookie("refreshToken");
//     res.clearCookie("is_verified");

//     // Send success response
//     return res.status(200).json({
//       status: "success",
//       message: "Successfully logged out",
//     });
//   } catch (error) {
//     console.error("Error during logout:", error);
//     return res.status(500).json({
//       status: "failed",
//       message: "An error occurred while processing your request. Please try again later.",
//     });
//   }
// };

// export default logoutController;
