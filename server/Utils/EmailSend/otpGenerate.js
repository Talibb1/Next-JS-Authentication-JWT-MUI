import bcrypt from "bcrypt";

export const generateOtp = () =>
  Math.floor(1000 + Math.random() * 9000).toString();
export const tokensGenerate = () =>
  Math.floor(1000 + Math.random() * 9000).toString();

export const hashOtp = async (otp, saltRounds, pepper) => {
  return await bcrypt.hash(otp + pepper, saltRounds);
};

export const saveOtpToDatabase = async (
  UserOtpModel,
  userId,
  hashedOtp,
  hashedToken
) => {
  const otpExpiry = Date.now() + 2 * 60 * 1000; // OTP expires in 2 minute
  const tokenExpiry = Date.now() + 60 * 60 * 1000; // Token expires in 6 minute (can be adjusted)

  await UserOtpModel.updateOne(
    { userId },
    { otp: hashedOtp, otpExpiry, token: hashedToken, tokenExpiry },
    { upsert: true }
  );
};

// export const saveOtpToDatabase = async (UserOtpModel, userId, hashedOtp) => {
//   const otpExpiry = Date.now() + 60 * 1000; // OTP expires in 1 minute
//   await UserOtpModel.updateOne(
//     { userId },
//     { otp: hashedOtp, otpExpiry },
//     { upsert: true }
//   );
// };
