import UserModel from '../Model/User.js';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();


// JWT strategy options
var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_KEY,
};

// Configure the JWT strategy
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    // Find the user based on the JWT payload
    const user = await UserModel.findById(jwt_payload._id).select('-password');

    if (user) {
      // User found, proceed with authentication
      return done(null, user);
    } else {
      // User not found, authentication failed
      return done(null, false, { message: 'Invalid token' });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    return done(error, false);
  }
}));
