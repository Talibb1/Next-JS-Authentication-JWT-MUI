import Loader from "@/components/Loader";
import ForgotPass from "@/components/pages/ForgotPassword/ForgotPass";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password and regain access to your account.",
  icons: {
    icon: "/assets/icons-account.png",
  },
};

const ForgotPassword = () => {
  return (
    <>
    <Suspense fallback={<Loader/>}>
      <ForgotPass />
    </Suspense>
    </>
 
  );
};

export default ForgotPassword;
