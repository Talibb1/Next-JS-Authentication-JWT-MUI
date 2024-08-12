import ResetPassword from "@/components/pages/ResetPassword/ResetPasswordPage";
import type { Metadata } from "next";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password and regain access to your account.",
  icons: {
    icon: "/assets/icons-account.png",
  },
};

const ResetPass = () => {
  return (

    <Suspense fallback={<div>Loading...</div>}>
        <ResetPassword />
     
    </Suspense>
  );
};

export default ResetPass;
