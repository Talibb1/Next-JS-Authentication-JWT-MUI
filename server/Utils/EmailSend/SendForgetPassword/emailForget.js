import sendEmail from "./forgerSendEmail.js";

export const emailForget = async (email, token, id, userName) => {
  const createObfuscatedQuery = (id, token) => {
    const query = `u=${encodeURIComponent(id)}&v=${encodeURIComponent(token)}`;
    const base64Query = Buffer.from(query).toString("base64");
    return base64Query;
  };

  const obfuscatedQuery = createObfuscatedQuery(id, token);
  const resetLink = `${process.env.FRONTEND_HOST_PRODUCTION}/Reset-Password?data=${obfuscatedQuery}`;
  await sendEmail({
    to: email,
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
            <p>Hello ${userName || "User"},</p>
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
};
