import OTPVerificationPage from "@/components/pages/OtpForm/OTPVerification";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password and regain access to your account.",
  icons: {
    icon: "/assets/icons-account.png",
  },
};

const Otp = () => {
  return (
<OTPVerificationPage/>
  );
};

export default Otp;
