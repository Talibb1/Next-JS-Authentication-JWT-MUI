// Thtis Endpoint is used to set the auth header in the request also this used in only mobile application



// import refreshAccessToken from "../Utils/RefreshAccessToken/refreshAccessToken.js";
// import setTokenCookies from "../Utils/GenerateToken/setTokenCookies.js";

// const newAccessTokenController = async (req, res) => {
//   try {
//     const {
//       newAccessToken,
//       newRefreshToken,
//       newRefreshTokenExp,
//       newAccessTokenExp,
//     } = await refreshAccessToken(req,res);

//     setTokenCookies(
//       res,
//       newAccessToken,
//       newRefreshToken,
//       newRefreshTokenExp,
//       newAccessTokenExp
//     );

//     res.status(200).json({
//       status: "success",
//       message: "New Token Generated",
//       access_Token: newAccessToken,
//       refresh_Token: newRefreshToken,
//       access_Token_Expiration: newAccessTokenExp,
//     });
//   } catch (error) {
//     // if (error.message === "User is blacklisted") {
//     //   return res.status(403).json({ message: error.message });
//     // }
//     if (!res.headersSent) {
//       res.status(500).json({ message: error.message || "Internal Server Error" });
//     }
//   }
// };

// export default newAccessTokenController;




