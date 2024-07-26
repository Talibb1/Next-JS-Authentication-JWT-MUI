import UserModel from "../Model/User.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import transporter from "../Utils/EmailSend/emailController.js";

dotenv.config();

const forgetPassword = async (req, res) => {
  try {
    // Extract email from request body
    const { email } = req.body;

    // Step 1: Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Step 2: Find user with provided email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Step 3: Generate a random token and set it in the user document
    const secretToken = user._id.toString() + process.env.JWT_ACCESS_KEY;
    const token = jwt.sign({ _id: user._id }, secretToken, {
      expiresIn: "15m", // Updated expiration time for better security
    });

    // Step 4: Create the password reset link
    const resetLink = `${process.env.FRONTEND_EMAIL_LINK}/account/reset-password-confirm/${user._id}/${token}`;

    // Step 5: Send email with reset link
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      replyTo: process.env.EMAIL_REPLY_TO,
      subject: "Password Reset Request",
      text: `Please click on the following link to reset your password: ${resetLink}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: #007bff;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .content p {
            margin: 0 0 10px;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            padding: 10px 20px;
            font-size: 16px;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #ddd;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hello ${user.name || "User"},</p>
            <p>We received a request to reset your password. You can reset your password by clicking the button below:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>Thank you,</p>
            <p>The E-Commerce Company Team</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} E-Commerce Company. All rights reserved.</p>
            <p>If you have any questions, please <a href="mailto:support@yourcompany.com">contact us</a>.</p>
        </div>
    </div>
</body>
</html>
`,
    });
    return res
      .status(200)
      .json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return res
      .status(500)
      .json({ message: "Unable to send email. Please try again later." });
  }
};

export default forgetPassword;
