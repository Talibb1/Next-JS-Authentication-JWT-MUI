import dotenv from "dotenv";
import transporter from "../emailController.js";

dotenv.config();

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      replyTo: process.env.EMAIL_REPLY_TO,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
