import bcrypt from "bcrypt";
import UserModel from "../Model/User.js";
import UserOtp from "../Model/UserOtp.js";
import transporter from "../Utils/EmailSend/emailController.js";

// Function to verify email using OTP
const VerifyEmail = async (req, res) => {
  try {
    // Extract email and otp from request body
    const { email, otp } = req.body;

    // Check if both email and otp are provided
    if (!email || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user with the provided email
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Email doesn't exist" });
    }

    // Check if the email is already verified
    if (existingUser.is_varified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Find the OTP entry associated with the user ID
    const emailVarified = await UserOtp.findOne({
      userId: existingUser._id,
    });

    if (!emailVarified) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Compare the provided OTP with the stored (hashed) OTP
    const isMatch = await bcrypt.compare(otp, emailVarified.otp);

    // If OTP entry is not found or OTP doesn't match
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if the OTP is expired (5 minutes = 300000 milliseconds)
    const currenTime = new Date();
    const expireTime = new Date(emailVarified.createdAt);
    const diff = currenTime - expireTime;

    if (diff > 300000) {
      await emailVarified.remove(); // Remove expired OTP entry
      return res.status(400).json({ message: "OTP expired, Please try again" });
    }

    // Mark the user as verified
    existingUser.is_varified = true;
    await existingUser.save();

    // Remove the OTP entry after successful verification
    // await emailVarified.remove();
    await UserOtp.deleteMany({ userId: existingUser._id });

   // Send congratulatory email with home link
   const homeLink = `${process.env.FRONTEND_HOME_LINK}`;
   await transporter.sendMail({
     from: process.env.EMAIL_FROM,
     to: existingUser.email,
     replyTo: process.env.EMAIL_REPLY_TO,
     subject: "Congratulations! Email Verified Successfully",
     text: `Congratulations! Your email has been verified successfully. You can now visit our home page at ${homeLink}.`,
     html: `
<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Email Verified</title>
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
           background: #28a745;
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
           background-color: #28a745;
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
           color: #28a745;
           text-decoration: none;
       }
   </style>
</head>
<body>
   <div class="container">
       <div class="header">
           <h1>Email Verified Successfully</h1>
       </div>
       <div class="content">
           <p>Hello ${existingUser.name || 'User'},</p>
           <p>Congratulations! Your email has been successfully verified.</p>
           <p>You can now visit our home page by clicking the button below:</p>
           <a href="${homeLink}" class="button">Go to Home Page</a>
           <p>If you have any questions, please contact us.</p>
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

   return res.status(200).json({ message: "Email verified successfully and congratulatory email sent" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unable to verify email, please try again" });
  }
};

export default VerifyEmail;
