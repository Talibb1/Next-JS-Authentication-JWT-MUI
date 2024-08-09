"use client";

import React from 'react';
import { TextField } from '@mui/material';
import { useField } from 'formik';

interface TextFieldComponentProps {
  name: string;
  label: string;
  type?: string;
  autoComplete: string;
  autoFocus?: boolean;
}

const TextFieldComponent: React.FC<TextFieldComponentProps> = ({
  name,
  label,
  type = 'text',
  autoComplete,
  autoFocus = false,
}) => {
  const [field, meta] = useField(name);
  return (
    <TextField
      {...field}
      fullWidth
      label={label}
      type={type}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      margin="normal"
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};

export default TextFieldComponent;
