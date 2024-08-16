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
      secure: process.env.NODE_ENV === 'production', // Adjust based on environment
      maxAge: accessTokenMaxAge,
      sameSite: 'None', // Adjust according to your requirements
      domain: process.env.NODE_ENV === 'production' ? '.example.com' : 'localhost', // Adjust for local testing
    });

    // Set Cookie for Refresh Token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: refreshTokenMaxAge,
      sameSite: 'None',
      domain: process.env.NODE_ENV === 'production' ? '.example.com' : 'localhost',
    });

    // Set Cookie for isAuth
    res.cookie('isAuth', true, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: refreshTokenMaxAge,
      sameSite: 'None',
      domain: process.env.NODE_ENV === 'production' ? '.example.com' : 'localhost',
    });
  } catch (error) {
    console.error('Failed to set cookies:', error);
    throw new Error('Failed to set cookies');
  }
};

export default setTokensCookies;
