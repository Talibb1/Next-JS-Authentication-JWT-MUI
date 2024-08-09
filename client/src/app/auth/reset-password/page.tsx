import ResetPassword from "@/components/pages/ResetPassword/ResetPasswordPage";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password and regain access to your account.",
  icons: {
    icon: "/assets/icons-account.png",
  },
};

const ResetPass = () => {
  return (

      <ResetPassword />

  );
};

export default ResetPass;
