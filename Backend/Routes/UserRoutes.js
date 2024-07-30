import express from "express";
const router = express.Router();
import RegisterUser from "../Controller/registrationConroller.js";
import VerifyEmail from "../Controller/verifyEmailController.js";
import userLogin from "../Controller/loginController.js";
import userProfile from "../Controller/userProfileController.js";
import passport from "passport";
import accessTokenAuto from "../middleware/accessTokenAuto.js";
import logoutController from "../Controller/logoutController.js";
import changeUserPassword from "../Controller/changepassConroller.js";
import forgetPassword from "../Controller/forgetPasswordController.js";
import passwordResetController from "../Controller/passwordResetController.js";
import ResendOtp from "../Controller/resendOtpController.js";
import otpResendLimiter from "../middleware/otpResendLimiter.js";
import blacklistUser from "../Controller/blacklistUserController.js";
import CancelRegistration from "../Controller/cancelRegistrationController.js";
// import blacklistUserController from "../Controller/blacklistUserController.js";
// import newAccessTokenController from "../Controller/newAccessTokenController.js";

// import checkUserAuth from "../middleware/authMiddleware.js";

// Router level Middleware To Protected Route
// router.use("/changepassword", checkUserAuth);
// router.use('/loggeduser', checkUserAuth);

// public Routes
router.post("/register", RegisterUser);
router.post("/resend-otp", otpResendLimiter, ResendOtp);
router.post("/varify-email", VerifyEmail);
router.post("/blacklist-User", blacklistUser);
router.post("/cancel-registration", CancelRegistration);
router.post("/login", userLogin);
router.post("/forgetPassword", forgetPassword);
router.post("/passwordReset", passwordResetController);
// router.post("/refresh-token", newAccessTokenController);
// router.post('/blacklist', blacklistUserController);
// router.post("/login", userlogin);
// router.get("/user/home", mainController.home);
// router.get("/register", mainController.register);
// router.get("/login", mainController.login);
// router.get("/resetPassword", mainController.resetPassword);
// router.get("/changePassword", mainController.changePassword);

// private/protected Routes

router.get(
  "/profile",
  accessTokenAuto,
  passport.authenticate("jwt", { session: false }),
  userProfile
);
router.post(
  "/logout",
  accessTokenAuto,
  passport.authenticate("jwt", { session: false }),
  logoutController
);
router.post(
  "/changeUserPassword",
  accessTokenAuto,
  passport.authenticate("jwt", { session: false }),
  changeUserPassword
);
// router.post("/changepassword", changeUserPassword);
// router.get('/loggeduser', loggedUser)

export default router;
