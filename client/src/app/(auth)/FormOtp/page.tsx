import OTPVerificationPage from "@/components/pages/OtpForm/OTPVerification";
import type { Metadata } from "next";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password and regain access to your account.",
  icons: {
    icon: "/assets/icons-account.png",
  },
};

const Otp = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OTPVerificationPage />
    </Suspense>
  );
};

export default Otp;
