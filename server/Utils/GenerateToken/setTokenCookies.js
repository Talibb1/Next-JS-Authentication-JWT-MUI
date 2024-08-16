const setTokensCookies = (res, accessToken, refreshToken, newAccessTokenExp, newRefreshTokenExp) => {
  if (!res || !accessToken || !refreshToken || !newAccessTokenExp || !newRefreshTokenExp) {
    throw new Error('Missing required parameters');
  }

  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  const accessTokenMaxAge = (newAccessTokenExp - currentTimeInSeconds) * 1000;
  const refreshTokenMaxAge = (newRefreshTokenExp - currentTimeInSeconds) * 1000;

  try {
    // Set Cookie for Access Token
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      maxAge: accessTokenMaxAge,
      sameSite: 'None', // Adjust according to your requirements
    });

    // Set Cookie for Refresh Token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      maxAge: refreshTokenMaxAge,
      sameSite: 'None', // Adjust according to your requirements
    });
    // Set Cookie for Refresh Token
    res.cookie('isAuth', true, {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      maxAge: refreshTokenMaxAge,
      sameSite: 'None', // Adjust according to your requirements
    });
  } catch (error) {
    // Handle errors appropriately
    throw new Error('Failed to set cookies');
  }
};

export default setTokensCookies;
