import bcrypt from "bcrypt";
import transporter from "./emailController.js";
import UserOtp from "../../Model/UserOtp.js";

const sendEmail = async (req, user) => {
  try {
    // Generate a random 5-digit OTP using crypto-js
    const otp = Math.floor(10000 + Math.random() * 90000).toString();

    // Hash the OTP before storing it in the database
    const hashedOtp = await bcrypt.hash(otp, Number(process.env.PEPPER));

    // Save the hashed OTP in the database
    await new UserOtp({
      userId: user._id,
      otp: hashedOtp,
    }).save();

    // Prepare the email content with the plain OTP
    const otpVerificationEmailLink = `${process.env.FRONTEND_HOST}/account/verify-email?otp=${otp}`;
    const getFormattedDate = () => {
      const date = new Date();
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-GB', options);
    };
    const formattedDate = getFormattedDate();
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM, // Sender address
      to: user.email, // List of receivers
      // cc: process.env.EMAIL_CC, // CC address
      // bcc: process.env.EMAIL_BCC, // BCC address
      replyTo: process.env.EMAIL_REPLY_TO, // Reply-To address
      text: `Your OTP is ${otp}`, // Plain text version
      subject: "OTP - Verify your email", // Subject line
      html: `
      <!DOCTYPE html>
<html lang="en">
  <head>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);
        background-repeat: no-repeat;
        background-size: 800px 452px;
        background-position: top center;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
        <table style="width: 100%;">
          <tbody>
            <tr style="height: 0;">
              <td>
                <img
                  alt=""
                  src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1663574980688_114990/archisketch-logo"
                  height="30px"
                />
              </td>
              <td style="text-align: right;">
                <span
                  style="font-size: 16px; line-height: 30px; color: #ffffff;"
                  >${formattedDate}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 92px 30px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Your OTP
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
              "
            >
              Hey ${user.name},
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
              "
            >
              Thank you for choosing E-Commerce Company. Use the following OTP
              to complete the procedure to change your email address. OTP is
              valid for
              <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>.
              Do not share this code with others.
            </p>
            <p
              style="
                margin: 0;
                margin-top: 60px;
                font-size: 40px;
                font-weight: 600;
                letter-spacing: 25px;
                color: #ba3d4f;
              "
            >
              ${otp}
            </p>
             <p><a href="${otpVerificationEmailLink}" style="background-color:#90EE90; color:#000000; display:inline-block; padding:12px 40px; margin-top: 10px; text-align:center; text-decoration:none;" target="_blank">Verify Email Now</a></p>
          </div>
        </div>

        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Need help? Ask at
          <a
            href="mailto:archisketch@gmail.com"
            style="color: #499fb6; text-decoration: none;"
            >${String(process.env.EMAIL_REPLY_TO)}</a
          >
          or visit our
          <a
            href=""
            target="_blank"
            style="color: #499fb6; text-decoration: none;"
            >Help Center</a
          >
        </p>
      </main>

      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
          E-Commerce Company
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343;">
          Address North Nazimabad Town, Karachi, Pakistan.
        </p>
        <div style="margin: 0; margin-top: 16px;">
          <a href="#" target="_blank" style="display: inline-block;">
            <img
              width="36px"
              alt="Facebook"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
            />
          </a>
          <a
            href="#"
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Instagram"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
          /></a>
          <a
            href="#"
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Twitter"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
            />
          </a>
          <a
            href="#"
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Youtube"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
          /></a>
        </div>
        <p style="margin: 0; margin-top: 16px; color: #434343;">
          Copyright ©  ${new Date().getFullYear()} Company. All rights reserved.
        </p>
      </footer>
    </div>
  </body>
</html>
`,
    });

    console.log("Message sent: %s", info.messageId); // devlopment perpuss only
    return info;
  } catch (error) {
    console.error("Error sending email:", error); // devlopment perpuss only
    throw error;
  }
};

export default sendEmail;
