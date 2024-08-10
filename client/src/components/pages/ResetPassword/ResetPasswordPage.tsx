"use client";

import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Formik, Form, FormikHelpers } from "formik";
import PasswordFieldComponent from "../../ui/PasswordField";
import { useRouter, useSearchParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { SvgImageResetPass } from "@/components/ui/SvgImage";
import ButtonComponent from "@/components/ui/Button";
import { ValidationResetPass } from "@/components/Validation";
import ToastNotification from "@/components/ui/Notification";
import { NotificationType } from "@/lib/types";
const ResetPasswordPage = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);

  const [toastConfig, setToastProps] = useState({
    type: "",
    message: "",
    trigger: false,
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const clearToast = useCallback(() => {
    setToastProps((prevState) => ({ ...prevState, trigger: false }));
  }, []);

  useEffect(() => {
    if (!token) {
      setToastProps({
        type: "error",
        message: "Invalid OTP request",
        trigger: true,
      });
    }
  }, [token]);

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      await authService.resetPassword({ token, password: values.password });
      setToastProps({
        type: "success",
        message: "Password reset successful!",
        trigger: true,
      });
      resetForm();

      setTimeout(() => {
        router.replace("/Login");
      }, 2000);
    } catch (error: any) {
      setToastProps({
        type: "error",
        message: error.data?.message || "Password reset failed. Please try again.",
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
            <SvgImageResetPass />
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
              Reset Your Password
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Please enter your new password below.
            </Typography>

            <Formik
              initialValues={initialValues}
              validationSchema={ValidationResetPass}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form noValidate>
                  <PasswordFieldComponent
                    name="password"
                    label="New Password"
                    autoComplete="new-password"
                    showPassword={showPassword}
                    handleClickShowPassword={handleClickShowPassword}
                  />
                  <PasswordFieldComponent
                    name="confirmPassword"
                    label="Confirm New Password"
                    autoComplete="new-password"
                    showPassword={showPassword}
                    handleClickShowPassword={handleClickShowPassword}
                  />
                  <ButtonComponent
                    type="submit"
                    fullWidth
                    sx={{ mt: 3, mb: 2 }}
                    isSubmitting={isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : "Reset Password"}
                  </ButtonComponent>
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

export default ResetPasswordPage;
