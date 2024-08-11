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

// public Routes
router.post("/register", RegisterUser);
router.post("/login", userLogin);
router.post("/forgetPassword", forgetPassword);
router.post("/blacklist-User", blacklistUser);
router.post("/varify-email", VerifyEmail);
router.post("/resend-otp", otpResendLimiter, ResendOtp);
router.post("/cancel-registration", CancelRegistration);
router.post("/forgetPasswordLink", passwordResetController);

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


export default router;
