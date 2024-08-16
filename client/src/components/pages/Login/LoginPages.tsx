"use client";

import React, { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Facebook as FacebookIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Formik, Form, FormikHelpers } from "formik";
import CheckboxComponent from "@/components/ui/Checkbox";
import PasswordFieldComponent from "@/components/ui/PasswordField";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SvgImageLogin } from "@/components/ui/SvgImage";
import TextFieldComponent from "@/components/ui/InputField";
import ButtonComponent from "@/components/ui/Button";
import { ValidationLogin } from "@/components/Validation";
import ToastNotification from "@/components/ui/Notification";
import { NotificationType } from "@/lib/types";
import { useLoginUserMutation } from "@/lib/services/api";
import CircularProgress from "@mui/material/CircularProgress";

const LoginPages = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const [loginUser] = useLoginUserMutation();

  const [showPassword, setShowPassword] = useState(false);

  const [toastConfig, setToastProps] = useState({
    type: "",
    message: "",
    trigger: false,
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const clearToast = useCallback(() => {
    setToastProps((prevState) => ({ ...prevState, trigger: false }));
  }, []);

  const initialValues = {
    email: "",
    password: "",
    remember: false,
  };
  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      const response = await loginUser(values).unwrap();
      // const user = response.user; // Fixed: Added 'user' variable
      const { token, email, isVerified } = response.user;

      setToastProps({
        type: "success",
        message: "Login successful!",
        trigger: true,
      });

      resetForm();

      setTimeout(() => {
        if (!isVerified) {
          const otpUrl = `/FormOtp?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
          router.replace(otpUrl);
        } else {
          router.replace("/");
        }
      }, 2000);
    } catch (error: any) {
      console.error("Error during login:", error);
      setToastProps({
        type: "error",
        message: error.data?.message || "Login failed. Please try again.",
        trigger: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Login with Google
const handleGoogleLogin = async () => {
  window.open(`https://next-js-authentication-jwt-mui-production.up.railway.app/auth/google`, "_self");
};

// Login with Facebook
const handleFacebookLogin = async () => {
  window.open(`https://next-js-authentication-jwt-mui-production.up.railway.app/auth/facebook`, "_self");
};

// Login with GitHub
const handleGitHubLogin = async () => {
  window.open(`https://next-js-authentication-jwt-mui-production.up.railway.app/auth/github`, "_self");
};


  return (
    <Container
      component="main"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
        padding: "0 2rem",
        overflow: "hidden",
      }}
    >
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent={{ xs: "center", md: "center" }}
        sx={{ maxWidth: "1200px" }}
      >
        {isLargeScreen && (
          <Grid item md={7}>
            <SvgImageLogin />
          </Grid>
        )}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginTop: isLargeScreen ? 0 : 8,
              width: isSmallScreen ? "100%" : "auto",
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{ mt: isLargeScreen ? 1 : 0 }}
            >
              Welcome to E-Commerce! 👋
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Please log-in to your account and start the adventure
            </Typography>

            <Formik
              initialValues={initialValues}
              validationSchema={ValidationLogin}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form noValidate>
                  <TextFieldComponent
                    name="email"
                    label="Email Address"
                    autoComplete="email"
                  />
                  <PasswordFieldComponent
                    name="password"
                    label="Password"
                    autoComplete="current-password"
                    showPassword={showPassword}
                    handleClickShowPassword={handleClickShowPassword}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <CheckboxComponent name="remember" label="Remember me" />
                    <Link href="/ForgotPassword">Forgot password?</Link>
                  </Box>

                  <ButtonComponent
                    type="submit"
                    fullWidth
                    sx={{ mt: 3, mb: 2 }}
                    isSubmitting={isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : "Log In"}
                  </ButtonComponent>

                  <Grid container justifyContent="center">
                    <Grid item>
                      Dont have an account?{" "}
                      <Link href="/Signup">{"Create an account"}</Link>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      mt: 4,
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      color="primary"
                      sx={{ mx: 2, fontSize: "3rem" }}
                      onClick={handleGoogleLogin}
                    >
                      <GoogleIcon fontSize="inherit" />
                    </IconButton>

                    <IconButton
                      color="primary"
                      sx={{ mx: 2, fontSize: "3rem" }}
                      onClick={handleGitHubLogin}
                    >
                      <GitHubIcon fontSize="inherit" />
                    </IconButton>

                    <IconButton
                      color="primary"
                      sx={{ mx: 2, fontSize: "3rem" }}
                      onClick={handleFacebookLogin}
                    >
                      <FacebookIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Grid>
      </Grid>
      <ToastNotification
        type={toastConfig.type as NotificationType | undefined}
        message={toastConfig.message}
        trigger={toastConfig.trigger}
        onClear={clearToast}
      />
    </Container>
  );
};

export default LoginPages;
