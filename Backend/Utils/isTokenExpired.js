import jwt from "jsonwebtoken";

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = jwt.decode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export default isTokenExpired;
