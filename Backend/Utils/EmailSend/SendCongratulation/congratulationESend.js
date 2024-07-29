import dotenv from "dotenv";
dotenv.config();
import transporter from "../emailController.js";

const sendEmail = async ({ to, subject, text, name, }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      replyTo: process.env.EMAIL_REPLY_TO,
      subject,
      text,
      html: `<!DOCTYPE html>
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
           <p>Hello ${name || 'User'},</p>
           <p>Congratulations! Your email has been successfully verified.</p>
           <p>You can now visit our home page by clicking the button below:</p>
           <a href="${process.env.FRONTEND_HOME_LINK}" class="button">Go to Home Page</a>
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
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
