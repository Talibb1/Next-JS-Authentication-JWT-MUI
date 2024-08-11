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
import { useForgetPasswordLinkMutation } from "@/lib/services/api";

// Define the expected structure of the decoded query object
interface DecodedQuery {
  _id: string;
  token: string;
}

// Explicitly type the `query` parameter as a string
const decodeQuery = (query: string): DecodedQuery => {
  const decodedQuery = Buffer.from(query, "base64").toString("utf-8");
  const params = new URLSearchParams(decodedQuery);

  return {
    _id: params.get("u") || "", 
    token: params.get("v") || "", 
  };
};

const ResetPasswordPage = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
  const [forgetPasswordLink] = useForgetPasswordLinkMutation();

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
    if (!data) {
      setToastProps({
        type: "error",
        message: "Invalid password reset request",
        trigger: true,
      });
    }
  }, [data]);

  const { _id, token } = decodeQuery(data || ""); // Ensure `data` is a string

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      await forgetPasswordLink({ _id:_id, token: token, Password: values.password, ConfirmPassword: values.confirmPassword }).unwrap();
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
