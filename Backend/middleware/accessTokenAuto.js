import setTokenCookies from "../Utils/GenerateToken/setTokenCookies.js";
import isTokenExpired from "../Utils/isTokenExpired.js";
import refreshAccessToken from "../Utils/RefreshAccessToken/refreshAccessToken.js";

const accessTokenAuto = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (accessToken && !isTokenExpired(accessToken)) {
      req.headers["authorization"] = `Bearer ${accessToken}`;
      return next();
    }

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is missing" });
    }

    const {
      newAccessToken,
      newRefreshToken,
      newRefreshTokenExp,
      newAccessTokenExp,
    } = await refreshAccessToken(req, res);

    setTokenCookies(
      res,
      newAccessToken,
      newRefreshToken,
      newRefreshTokenExp,
      newAccessTokenExp
    );

    req.headers["authorization"] = `Bearer ${newAccessToken}`;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default accessTokenAuto;
