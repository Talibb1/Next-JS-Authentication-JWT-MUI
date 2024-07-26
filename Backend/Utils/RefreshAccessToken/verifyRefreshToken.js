import jwt from "jsonwebtoken";
import RefreshToken from "../../Model/RefreshToken.js";

const verifyRefreshToken = async (refreshToken) => {
  try {
    // Verify if the refresh token is valid and not expired
    const refreshTokenExists = await RefreshToken.findOne({
      token: refreshToken,
    });
    if (!refreshTokenExists) {
      throw new Error("Invalid refresh token");
    }
    // Verify the refresh token
    const tokenDetail = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    return {
      tokenDetail,
      error: false,
      message: "Refresh token verified successfully",
    };

    // Check if the user is blacklisted
    // const user = await User.findById(decoded._id);
    // if (user.blacklisted) {
    //   throw new Error("User is blacklisted");
    // }
    // return { userId: decoded._id, roles: decoded.roles };

    // } else if (refreshTokenExists.blacklisted) {
    //   throw new Error("Refresh token is blacklisted");
    // } else {
    //   return { userId: decoded._id, roles: decoded.roles };

    //   // Blacklist the refresh token after successful verification
    //   await RefreshToken.findByIdAndUpdate(
    //     refreshTokenExists._id,
    //     { blacklisted: true },
    //     { new: true }
    //   );
    //   return { userId: decoded._id, roles: decoded.roles };
  } catch (error) {
    throw { error: true, message: "Invalid refresh token" };
  }
};

export default verifyRefreshToken;

// import jwt from "jsonwebtoken";
// import RefreshToken from "../Model/RefreshToken.js";

// const verifyRefreshToken = async (refreshToken) => {
//   const refreshTokenExists = await RefreshToken.findOne({ token: refreshToken });
//   if (!refreshTokenExists) {
//     throw new Error("Invalid refresh token");
//   }

//   try {
//     const tokenDetail = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
//     return {
//       tokenDetail,
//       message: "Refresh token verified successfully",
//     };
//   } catch (error) {
//    throw new Error("Invalid refresh token");
//   }
// };

// export default verifyRefreshToken;
