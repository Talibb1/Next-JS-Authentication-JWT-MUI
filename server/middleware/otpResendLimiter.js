import rateLimit from "express-rate-limit";

const otpResendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // limit each IP to 3 requests per windowMs
  message: "Too many OTP requests from this IP, please try again after an hour",
});

export default otpResendLimiter;
