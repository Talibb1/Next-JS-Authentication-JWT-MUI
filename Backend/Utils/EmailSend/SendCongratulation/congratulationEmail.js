import sendEmail from "./congratulationESend.js";

export const sendCongratulationEmail = async (userEmail, userName) => {
  const subject = "Congratulations! Your Email is Verified";
  const text = `Dear ${userName},\n\nCongratulations! Your email address has been successfully verified.\n\nThank you,\nE-commerce Team`;

  await sendEmail({
    to: userEmail,
    subject: subject,
    text: text,
    name: userName,
  });
};
