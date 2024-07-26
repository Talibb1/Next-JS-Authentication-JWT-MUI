
// Thtis moiddleware is used to set the auth header in the request also this used in only mobile application

// import isTokenExpired from "../Utils/isTokenExpired.js";

// const setAuthHeader = async (req, res, next) => {
//   try {
//     // Extract the old refresh token from the cookies
//     const accessToken = req.cookies.accessToken;

//     // Verify that the refresh token is valid Or Not
//     if (accessToken || !isTokenExpired(accessToken)) {
//       req.headers["authorization"] = `Bearer ${accessToken}`;
//     }
//     next();
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export default setAuthHeader;
