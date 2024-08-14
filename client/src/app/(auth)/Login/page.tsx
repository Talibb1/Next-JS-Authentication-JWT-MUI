import Loader from "@/components/Loader";
import Login from "@/components/pages/Login/LoginPages";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password and regain access to your account.",
  icons: {
    icon: "/assets/icons-account.png",
  },
};

const login = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Login />
    </Suspense>
  );
};

export default login;
