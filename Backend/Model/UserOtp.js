import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpiry: {
    type: Date,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  tokenExpiry: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure the OTP and Token documents are automatically deleted after they expire
otpSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ tokenExpiry: 1 }, { expireAfterSeconds: 0 });

const UserOtp = mongoose.model("UserOtp", otpSchema);

export default UserOtp;
