"use client";

import React, { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Google as GoogleIcon, GitHub as GitHubIcon, Facebook as FacebookIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Formik, Form, FormikHelpers } from "formik";
import CheckboxComponent from "../../ui/Checkbox";
import PasswordFieldComponent from "../../ui/PasswordField";
import { useRouter } from "next/navigation";
import Link from "next/link";
import  CircularProgress  from "@mui/material/CircularProgress";
import { SvgImageSignUp } from "@/components/ui/SvgImage";
import ButtonComponent from "@/components/ui/Button";
import { ValidationSignup } from "@/components/Validation";
import ToastNotification from "@/components/ui/Notification";
import { NotificationType } from "@/lib/types";
import { authService } from "@/lib/services/authService";
import TextFieldComponent from "@/components/ui/InputField";
const SignupPages = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [toastConfig, setToastProps] = useState({
    type: "",
    message: "",
    trigger: false,
  });

  const clearToast = useCallback(() => {
    setToastProps((prevState) => ({ ...prevState, trigger: false }));
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    remember: false,
  };

  const onSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: FormikHelpers<typeof initialValues>) => {
    try {
      const response = await authService.register(values);
      const { token } = response;
      setToastProps({
        type: "success",
        message: "SignUp successful!",
        trigger: true,
      });

      resetForm();

      setTimeout(() => {
        const loginUrl = `/Login?token=${encodeURIComponent(token)}`;
        router.replace(loginUrl);
      }, 2000);
    } catch (error: any) {
      setToastProps({
        type: "error",
        message: error.response?.data?.message || "Signup failed. Please try again.",
        trigger: true,
      });
    } finally {
      setSubmitting(false);
    }
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
            <SvgImageSignUp />
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
              Please sign-in to your account and start the adventure
            </Typography>
            <Formik
              initialValues={initialValues}
              validationSchema={ValidationSignup}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form noValidate>
                  <TextFieldComponent
                    name="name"
                    label="Full Name"
                    autoComplete="name"
                  />
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
                  <PasswordFieldComponent
                    name="confirmPassword"
                    label="Confirm Password"
                    autoComplete="confirm-password"
                    showPassword={showPassword}
                    handleClickShowPassword={handleClickShowPassword}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <CheckboxComponent
                      name="remember"
                      label="I do not wish to receive news and promotions from Freepik Company by email."
                    />
                  </Box>
                  <ButtonComponent
                    type="submit"
                    fullWidth
                    sx={{ mt: 3, mb: 2 }}
                    isSubmitting={isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={24} />  : "Sign Up"}
                  </ButtonComponent>
                  <Grid container justifyContent="center">
                    <Grid item>
                      Already have an account?{" "}
                      <Link href="/Login">{"Login"}</Link>
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
                      href="#"
                      sx={{ mx: 2, fontSize: "3rem" }}
                    >
                      <GoogleIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      color="primary"
                      href="#"
                      sx={{ mx: 2, fontSize: "3rem" }}
                    >
                      <GitHubIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      color="primary"
                      href="#"
                      sx={{ mx: 2, fontSize: "3rem" }}
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

export default SignupPages;
