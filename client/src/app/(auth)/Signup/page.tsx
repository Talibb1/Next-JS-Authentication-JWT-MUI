import Loader from "@/components/Loader";
import SignUpPage from "@/components/pages/Signup/SignupPages";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password and regain access to your account.",
  icons: {
    icon: "/assets/icons-account.png",
  },
};

const signup = () => {
  return (
    <Suspense fallback={<Loader />}>
      <SignUpPage />
    </Suspense>
  );
};

export default signup;
