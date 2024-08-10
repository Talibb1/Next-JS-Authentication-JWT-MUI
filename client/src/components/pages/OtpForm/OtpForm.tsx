import React, { useState, useEffect, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MailLockIcon from "@mui/icons-material/MailLock";
import { useRouter, useSearchParams } from "next/navigation";
import OtpInput from "./OtpInput";
import { NotificationType } from "@/lib/types";
import ToastNotification from "../../ui/Notification";
import {
  useVerifyEmailMutation,
  useResendOtpMutation,
  useCancelRegistrationMutation
} from "@/lib/services/api";

const OtpForm: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [timer, setTimer] = useState<number>(60);
  const [error, setError] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [toastConfig, setToastConfig] = useState({
    type: "" as NotificationType,
    message: "",
    trigger: false,
  });

  const clearToast = useCallback(() => {
    setToastConfig((prevState) => ({ ...prevState, trigger: false }));
  }, []);

  useEffect(() => {
    if (!token || !email) {
      setToastConfig({
        type: "error",
        message: "Invalid OTP request",
        trigger: true,
      });
    }
  }, [token, email]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (/^\d?$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError(false);

        if (value && index < otp.length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      }
    };

  const handleKeyDown =
    (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace" && otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

  const [verifyEmail] = useVerifyEmailMutation();
  const [resendOtp] = useResendOtpMutation();
  const [cancelRegistration] = useCancelRegistrationMutation();

  const handleVerify = async () => {
    if (!token || !email) return;

    if (otp.includes("")) {
      setError(true);
      setToastConfig({
        type: "error",
        message: "Please fill in all the boxes.",
        trigger: true,
      });
    } else {
      setIsButtonDisabled(true);

      try {
        const result = await verifyEmail({ token, email, otp: otp.join("") }).unwrap();
        setToastConfig({
          type: "success",
          message: result.message,
          trigger: true,
        });
        setTimeout(() => {
          router.replace("/");
        }, 2000);
      } catch (error: any) {
        const errorMessage = error.data?.message || "OTP verification failed";
        setToastConfig({
          type: "error",
          message: errorMessage,
          trigger: true,
        });
      } finally {
        setIsButtonDisabled(false);
        setOtp(Array(4).fill("")); // Clear the OTP input fields
      }
    }
  };

  const handleResend = async () => {
    if (!email) return;

    try {
      await resendOtp({ email: email }).unwrap();
      setOtp(Array(4).fill(""));
      setTimer(60);
      setError(false);
      setIsButtonDisabled(false);
      setToastConfig({
        type: "info",
        message: "OTP resent to your email.",
        trigger: true,
      });
    } catch (error: any) {
      const errorMessage = error.data?.message || "Failed to resend OTP. Please try again.";
      setToastConfig({
        type: "error",
        message: errorMessage,
        trigger: true,
      });
    }
  };

  const handleCancel = async () => {
    if (!email) return;

    try {
      await cancelRegistration({ email: email }).unwrap();
      setToastConfig({
        type: "success",
        message: "OTP request canceled.",
        trigger: true,
      });
      setTimeout(() => {
        router.replace("/Login");
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.data?.message || "Failed to cancel OTP request.";
      setToastConfig({
        type: "error",
        message: errorMessage,
        trigger: true,
      });
    }
  };

  return (
    <Container maxWidth="sm" style={{ paddingTop: "5rem" }}>
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 1,
          borderRadius: 2,
          p: 5,
          textAlign: "center",
        }}
      >
        <IconButton
          sx={{ fontSize: "5.5rem", color: "primary.light" }}
          disableRipple
        >
          <MailLockIcon fontSize="inherit" />
        </IconButton>
        <Typography variant="h5" component="p" gutterBottom>
          Please check your email
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          We’ve sent a code to {email}
        </Typography>
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          {otp.map((digit, index) => (
            <OtpInput
              key={index}
              digit={digit}
              index={index}
              inputRefs={inputRefs}
              error={error}
              handleChange={handleChange}
              handleKeyDown={handleKeyDown}
            />
          ))}
        </Grid>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Didn’t get the code?{" "}
          {timer > 0 ? (
            <>Resend code in {timer}s</>
          ) : (
            <Button variant="text" color="primary" onClick={handleResend}>
              Click to resend.
            </Button>
          )}
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            Please fill in all the boxes.
          </Typography>
        )}
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={6}>
            <Button variant="outlined" fullWidth onClick={handleCancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleVerify}
              disabled={isButtonDisabled}
            >
              Verify
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ToastNotification
        type={toastConfig.type}
        message={toastConfig.message}
        trigger={toastConfig.trigger}
        onClear={clearToast}
      />
    </Container>
  );
};

export default OtpForm;
