import refreshAccessToken from "../Utils/RefreshAccessToken/refreshAccessToken.js";
import isTokenExpired from "../Utils/isTokenExpired.js";
import setTokensCookies from "../Utils/GenerateToken/setTokenCookies.js";

const accessTokenAutoRefresh = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    
    // Check if the access token is present and valid
    if (accessToken && !isTokenExpired(accessToken)) {
      // Add the access token to the Authorization header
      req.headers['authorization'] = `Bearer ${accessToken}`;
    } else {
      // Access token is missing or expired
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        // Refresh token is also missing, return an error
        return res.status(401).json({
          status: "failed",
          message: "Refresh token is missing",
        });
      }

      // Attempt to refresh the access token
      const { newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp } = await refreshAccessToken(req, res);

      // Set new tokens in cookies
      setTokensCookies(res, newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp);

      // Add the new access token to the Authorization header
      req.headers['authorization'] = `Bearer ${newAccessToken}`;
    }

    next();
  } catch (error) {
    console.error('Error in accessTokenAutoRefresh middleware:', error.message);
    // Return an error response
    res.status(401).json({
      status: "failed",
      message: "Unauthorized access or token refresh failed",
    });
  }
};

export default accessTokenAutoRefresh;
