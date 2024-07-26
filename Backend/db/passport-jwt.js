import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserModel from "../Model/User.js";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_KEY,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await UserModel.findById(jwt_payload._id).select("-password -is_varified -createdAt -updatedAt -__v");
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

export default passport;




// import UserModel from "../Model/User.js";
// import passport from "passport";
// import { Strategy as jwtStrategy, ExtractJwt } from "passport";
// const options = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.JWT_ACCESS_KEY,
// }
// passport.use(new jwtStrategy(options, function(jwt_payload, done) {
//     UserModel.findOne({id: jwt_payload._id},  "-password", 
//         function(err, user) { 
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//             // or you could create a new account
//         }
//     });
// }));