import passport from "passport";
import express from "express";
import setTokensCookies from '../Utils/GenerateToken/setTokenCookies.js';
import {FRONTEND_HOST} from "../constants/constants.js";

const handleAuthCallback = (req, res) => {
  const { user, accessToken, refreshToken, accessTokenExp, refreshTokenExp } = req.user;
  setTokensCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp);

  // Successful authentication, redirect home.
  res.redirect(`${FRONTEND_HOST}`);
};

export const createAuthRoutes = (passportStrategy, scope = ['profile', 'email']) => {
  const router = express.Router();

  
  router.get(`/auth/${passportStrategy}`,
    passport.authenticate(passportStrategy, { session: false, scope }));

  router.get(`/auth/${passportStrategy}/callback`,
    passport.authenticate(passportStrategy, { session: false, failureRedirect: `${FRONTEND_HOST}/Login` }),
    handleAuthCallback);

  return router;
};
