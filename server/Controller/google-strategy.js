// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import passport from 'passport';
// import bcrypt from 'bcrypt'
// import UserModel from '../Model/User.js';
// import generateTokens from '../Utils/GenerateToken/generateToken.js';
// import { GOOGLE_CLIENT_ID ,GOOGLE_CLIENT_SECRET } from '../constants/constants.js'

// passport.use(new GoogleStrategy({
//   clientID: GOOGLE_CLIENT_ID,
//   clientSecret: GOOGLE_CLIENT_SECRET,
//   callbackURL: "/auth/google/callback"
// },
//   async ( profile, done) => {
//     console.log("Profile", profile);
//     try {
//       // Check if user already exists in the database
//       let user = await UserModel.findOne({ email: profile._json.email });
//       if (!user) {
//         const lastSixDigitsID = profile.id.substring(profile.id.length - 6);
//         const lastTwoDigitsName = profile._json.name.substring(profile._json.name.length - 2);
//         const newPass = lastTwoDigitsName + lastSixDigitsID
//         // Generate salt and hash password
//         const salt = await bcrypt.genSalt(Number(process.env.SALT));
//         const hashedPassword = await bcrypt.hash(newPass, salt);
//         user = await UserModel.create({
//           name: profile._json.name,
//           email: profile._json.email,
//           is_verified: true,
//           is_verified : profile._json.email_verified
//           password: hashedPassword,
//         })
//       }
//       // Generate JWT tokens
//       const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateTokens(user);
//       return done(null, { user, accessToken, refreshToken, accessTokenExp, refreshTokenExp });

//     } catch (error) {
//       return done(error);
//     }
//   }
// ));



import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import bcrypt from 'bcrypt';
import UserModel from '../Model/User.js';
import generateTokens from '../Utils/GenerateToken/generateToken.js';
import { SALT, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../constants/constants.js';

const createOrUpdateUser = async (profile, done) => {
  try {
    let user = await UserModel.findOne({ email: profile._json.email });
    if (!user) {
      const lastSixDigitsID = profile.id.substring(profile.id.length - 6);
      const lastTwoDigitsName = profile._json.name.substring(profile._json.name.length - 2);
      const newPass = lastTwoDigitsName + lastSixDigitsID;

      // Generate salt and hash password
      const salt = await bcrypt.genSalt(Number(SALT));
      const hashedPassword = await bcrypt.hash(newPass, salt);
      
      user = await UserModel.create({
        name: profile._json.name,
        email: profile._json.email,
        is_auth: true,
        is_verified: true,
        password: hashedPassword,
      });
    }

    // Generate JWT tokens
    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateTokens(user);
    return done(null, { user, accessToken, refreshToken, accessTokenExp, refreshTokenExp });

  } catch (error) {
    return done(error);  // This will correctly pass the error to Passport
  }
};

// Configure Google Strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
  (profile, done) => {
    createOrUpdateUser(profile, done);  // Ensure 'done' is passed correctly
  }
));

// Configure Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_CLIENT_ID,
  clientSecret: FACEBOOK_CLIENT_SECRET,
  callbackURL: "/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name'] // Adjust the fields as necessary
},
  (profile, done) => {
    const formattedProfile = {
      id: profile.id,
      _json: {
        email: profile.emails[0].value,
        name: `${profile.name.givenName} ${profile.name.familyName}`,
      },
    };
    createOrUpdateUser(formattedProfile, done);  // Ensure 'done' is passed correctly
  }
));
passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback",
  scope: ['user:email']
},
  async (profile, done) => {
    try {
      // Access email directly from the profile object
      let email = profile.emails && profile.emails[0] && profile.emails[0].value;

      if (!email) {
        // Handle the case where no email is found
        return done(null, false, { message: 'No email found in GitHub profile' });
      }

      const formattedProfile = {
        id: profile.id,
        _json: {
          email: email,
          name: profile.displayName || profile.username,
        },
      };
      createOrUpdateUser(formattedProfile, done);

    } catch (error) {
      return done(error);
    }
  }
));
