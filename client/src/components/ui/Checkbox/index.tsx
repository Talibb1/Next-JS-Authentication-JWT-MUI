"use client";

import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';
import { useField } from 'formik';

interface CheckboxComponentProps {
  name: string;
  label: string;
}

const CheckboxComponent: React.FC<CheckboxComponentProps> = ({ name, label }) => {
  const [field] = useField({ name, type: 'checkbox' });
  return (
    <FormControlLabel
      control={<Checkbox {...field} color="primary" />}
      label={label}
    />
  );
};

export default CheckboxComponent;
