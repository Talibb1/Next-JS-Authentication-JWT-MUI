"use client";

import React, { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useField } from "formik";

interface PasswordFieldComponentProps {
  name: string;
  label: string;
  autoComplete: string;
  showPassword: boolean;
  handleClickShowPassword: () => void;
}

const PasswordFieldComponent: React.FC<PasswordFieldComponentProps> = ({
  name,
  label,
  autoComplete,
  showPassword,
  handleClickShowPassword,
}) => {
  const [field, meta] = useField(name);

  return (
    <TextField
      {...field}
      fullWidth
      label={label}
      type={showPassword ? "text" : "password"}
      autoComplete={autoComplete}
      margin="normal"
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordFieldComponent;
