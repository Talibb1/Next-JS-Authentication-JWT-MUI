import Login from "@/components/pages/Login/LoginPages";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password and regain access to your account.",
  icons: {
    icon: "/assets/icons-account.png",
  },
};

const login = () => {
  return (

      <Login />

  );
};

export default login;
