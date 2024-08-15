import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import UserModel from '../Model/User.js';
import generateTokens from '../Utils/GenerateToken/generateToken.js';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../constants/constants.js';

const createOrUpdateUser = async (profile, provider, done) => {
  try {
    let user = await UserModel.findOne({ email: profile._json.email });

    if (!user) {
      user = await UserModel.create({
        name: profile._json.name,
        email: profile._json.email,
        isAuth: true,
        isVerified: true,
        [`${provider}Id`]: profile.id,
        authProvider: [provider],
      });
    } else {
      user[`${provider}Id`] = profile.id;

      if (!user.authProvider.includes(provider)) {
        user.authProvider.push(provider);
      }
      user.isAuth = true;
      user.isVerified = true;
      await user.save();
    }

    // Generate JWT tokens
    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateTokens(user);
    return done(null, { user, accessToken, refreshToken, accessTokenExp, refreshTokenExp });

  } catch (error) {
    return done(null, false, { message: `Error with ${provider} authentication` });
  }
};

// Configure Google Strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
  (accessToken, refreshToken, profile, done) => {
    if (!profile._json.email) {
      return done(null, false, { message: 'No email found in Google profile' });
    }
    createOrUpdateUser(profile, 'google', done);
  }
));

// Configure Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_CLIENT_ID,
  clientSecret: FACEBOOK_CLIENT_SECRET,
  callbackURL: "/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name']
},
  (accessToken, refreshToken, profile, done) => {
    if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
      return done(null, false, { message: 'No email found in Facebook profile' });
    }
    const formattedProfile = {
      id: profile.id,
      _json: {
        email: profile.emails[0].value,
        name: `${profile.name.givenName} ${profile.name.familyName}`,
      },
    };
    createOrUpdateUser(formattedProfile, 'facebook', done);
  }
));

// Configure GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback",
  scope: ['user:email']
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let email = profile.emails && profile.emails[0] && profile.emails[0].value;

      if (!email) {
        return done(null, false, { message: 'No email found in GitHub profile' });
      }
      const formattedProfile = {
        id: profile.id,
        _json: {
          email: email,
          name: profile.displayName || profile.username,
        },
      };
      createOrUpdateUser(formattedProfile, 'github', done);
    } catch (error) {
      return done(null, false, { message: 'Error with GitHub authentication' });
    }
  }
));
