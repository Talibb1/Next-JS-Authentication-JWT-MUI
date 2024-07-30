const setTokenCookies = (
  res,
  accessToken,
  refreshToken,
  refreshTokenExp,
  accessTokenExp
) => {
  const accessTokenMixAge =
    (accessTokenExp - Math.floor(Date.now() / 1000)) * 1000;
  const refreshTokenMixAge =
    (refreshTokenExp - Math.floor(Date.now() / 1000)) * 1000;

  // accessToken cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true, // set true to use secure cookies hhttps
    maxAge: accessTokenMixAge,
    // SameSite: "none",
    // SameSite: "lax",
    SameSite: "strict", // adjust according to your requirement
  });

  // accessToken cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // set true to use secure cookies hhttps
    maxAge: refreshTokenMixAge,
    // SameSite: "none",
    // SameSite: "lax",
    SameSite: "strict", // adjust according to your requirement
  });
};

export default setTokenCookies;
