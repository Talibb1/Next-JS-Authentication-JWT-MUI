import ForgotPass from "@/components/pages/ForgotPassword/ForgotPass";
import { Suspense } from "react";
import type { Metadata } from "next";
import Loader from "@/components/Loader";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password and regain access to your account.",
  icons: {
    icon: "/assets/icons-account.png",
  },
};

const ForgotPassword = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ForgotPass />
    </Suspense>
  );
};

export default ForgotPassword;
