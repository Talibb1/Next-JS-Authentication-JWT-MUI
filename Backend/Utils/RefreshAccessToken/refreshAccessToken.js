// Chat  GPt
// import RefreshToken from "../../Model/RefreshToken.js";
// import UserModel from "../../Model/User.js";
// import generateTokens from "../GenerateToken/generateToken.js";
// import verifyRefreshToken from "./verifyRefreshToken.js";

// const refreshAccessToken = async (req, res) => {
//   try {
//     // Extract the old refresh token from the cookies
//     const oldRefreshToken = req.cookies.refreshToken;

//     // Verify the refresh token
//     const { tokenDetail, error } = await verifyRefreshToken(oldRefreshToken);

//     if (error) {
//       return res.status(401).json({ message: "Invalid Refresh Token" });
//     }

//     // Check if the user exists
//     const user = await UserModel.findById(tokenDetail._id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if the refresh token exists and is valid
//     const userRefreshToken = await RefreshToken.findOne({
//       user: tokenDetail._id,
//     });

//     if (!userRefreshToken || userRefreshToken.blacklisted) {
//       return res
//         .status(401)
//         .json({ message: "Invalid or blacklisted Refresh Token" });
//     }

//     // Generate new tokens with updated expiration times
//     const { accessToken, refreshToken, refreshTokenExp, accessTokenExp } =
//       await generateTokens(user);
//     return {
//       newAccessToken: accessToken,
//       newRefreshToken: refreshToken,
//       newRefreshTokenExp: refreshTokenExp,
//       newAccessTokenExp: accessTokenExp,
//     };
//   } catch (error) {
//     return res.status(500).json({ message: "Internal Sever Error" });
//   }
// };

// export default refreshAccessToken;

import RefreshToken from "../../Model/RefreshToken.js";
import UserModel from "../../Model/User.js";
import generateTokens from "../GenerateToken/generateToken.js";
import verifyRefreshToken from "./verifyRefreshToken.js";

const refreshAccessToken = async (req, res) => {
  try {
    // Extract the old refresh token from the cookies
    const oldAccessToken = req.cookies.refreshToken;

    // Verify that the refresh token is valid Or Not
    const { tokenDetail, error } = await verifyRefreshToken(oldAccessToken);

    if (error) {
      return res.status(401).json({ message: "Invalid Refresh Token" });
    }

    // Check if the user exists
    const user = await UserModel.findById(tokenDetail._id);
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    // Check if the user is blacklisted
    // const isBlacklisted = await Blacklist.findOne({ user: tokenDetail._id });
    // if (isBlacklisted) {
    //   throw new Error("User is blacklisted");
    // }

    // Check if the refresh token is blacklisted
    const userRefreshToken = await RefreshToken.findOne({
      user: tokenDetail._id,
    });

    if (
      oldAccessToken !== userRefreshToken.token ||
      userRefreshToken.blacklisted
    ) {
      return res.status(401).json({ message: "Invalid Refresh Token" });
    }

    // Generate new tokens with updated expiration time
    const { accessToken, refreshToken, refreshTokenExp, accessTokenExp } =
      await generateTokens(user);
    return {
      newAccessToken: accessToken,
      newRefreshToken: refreshToken,
      newRefreshTokenExp: refreshTokenExp,
      newAccessTokenExp: accessTokenExp,
    };
  } catch (error) {
    return res.status(500).json({ message: "Internal Sever Error" });
  }
};

export default refreshAccessToken;
