// import mongoose from "mongoose";

// const otpSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "User",
//   },
//   otp: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     // expires: "5m"
//   },

// });

// const UserOtp = mongoose.model("UserOtp", otpSchema);
// export default UserOtp;
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

otpSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });

const UserOtp = mongoose.model("UserOtp", otpSchema);
export default UserOtp;

