import ForgotPass from "@/components/pages/ForgotPassword/ForgotPass";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password and regain access to your account.",
  icons: {
    icon: "/assets/icons-account.png",
  },
};

const ForgotPassword = () => {
  return (

      <ForgotPass />

  );
};

export default ForgotPassword;
