"use client";

import React, { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Formik, Form, FormikHelpers } from "formik";
import Link from "next/link";
import { SvgImageForgotPass } from "@/components/ui/SvgImage";
import TextFieldComponent from "@/components/ui/InputField";
import ButtonComponent from "@/components/ui/Button";
import { ValidationForgotPass } from "@/components/Validation";
import ToastNotification from "@/components/ui/Notification";
import { NotificationType } from "@/lib/types";
import { useForgetPasswordMutation } from "@/lib/services/api";

const ForgotPass = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [forgetPassword] = useForgetPasswordMutation();

  const [toastConfig, setToastConfig] = useState({
    type: "",
    message: "",
    trigger: false,
  });

  const initialValues = {
    email: "",
  };
  const clearToast = useCallback(() => {
    setToastConfig((prevState) => ({ ...prevState, trigger: false }));
  }, []);

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      // Perform the request
      await forgetPassword({ email: values.email }).unwrap();
      // Update toast to show success message
      setToastConfig({
        type: "success",
        message: "Instructions sent to your email!",
        trigger: true,
      });

      // Reset the form
      resetForm();

      // Redirect after a short delay to allow the toast to be visible
      setTimeout(() => {
        // router.push("/");
      }, 2000);
    } catch (error: any) {
      // Update toast to show error message
      setToastConfig({
        type: "error",
        message: error.data?.message  || "Please try again.",
        trigger: true,
      });
    } finally {
      // Stop the submitting state
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
            <SvgImageForgotPass />
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
              Forgot password! 🔐
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Enter your email and well send you instructions to reset your
              password
            </Typography>
            <Formik
              initialValues={initialValues}
              validationSchema={ValidationForgotPass}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form noValidate>
                  <TextFieldComponent
                    name="email"
                    label="Enter Your Email"
                    autoComplete="email"
                  />

                  <ButtonComponent
                    type="submit"
                    fullWidth
                    sx={{ mt: 3, mb: 2 }}
                    isSubmitting={isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
                  </ButtonComponent>

                  <Grid container justifyContent="center">
                    <Grid item>
                      <Link href="/Login">{"< Back to Login"}</Link>
                    </Grid>
                  </Grid>
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

export default ForgotPass;
