import SignUpPage from "@/components/pages/Signup/SignupPages";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password and regain access to your account.",
  icons: {
    icon: "/assets/icons-account.png",
  },
};

const signup = () => {
  return (

      <SignUpPage />

  );
};

export default signup;
