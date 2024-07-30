import sendEmail from "./sendEmail.js";

export const sendOtpEmail = async (email, otp, name, token) => {
  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
    name: name,
    otp:otp,
    token:token
  });
};
