import * as yup from 'yup';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const ValidationSignup = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().matches(EMAIL_REGEX, "Invalid email format").required("Email is required"),
    password: yup.string().required("Password is required").matches(PASSWORD_REGEX, "Password must be Strong"),
    confirmPassword: yup.string().required("Confirm Password is required").oneOf([yup.ref("password")], "Passwords must match"),
  });
export const ValidationLogin = yup.object({
    email: yup.string().matches(EMAIL_REGEX, "Invalid email format").required("Email is required"),
    password: yup.string().required("Password is required")
  });
export const ValidationForgotPass = yup.object({
    email: yup.string().matches(EMAIL_REGEX, "Invalid email format").required("Email is required"),
  });
export const ValidationResetPass = yup.object({
  password: yup.string().required("Password is required").matches(PASSWORD_REGEX, "Password must be Strong"),
  confirmPassword: yup.string().required("Confirm Password is required").oneOf([yup.ref("password")], "Passwords must match"),  });

