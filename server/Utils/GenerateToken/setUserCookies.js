const setUserCookies = (res, isAuth, userRole) => {
    try {
      // Set Cookie for Authentication Status
      res.cookie('is_auth', isAuth, {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        sameSite: 'strict', // Adjust according to your requirements
      });
  
      // Set Cookie for User Role
      res.cookie('role', userRole, {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        sameSite: 'strict', // Adjust according to your requirements
      });
    } catch (error) {
      // Handle errors appropriately
      throw new Error('Failed to set user cookies');
    }
  };
  
  export default setUserCookies;
  