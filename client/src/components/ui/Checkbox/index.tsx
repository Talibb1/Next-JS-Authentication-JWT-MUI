"use client";

import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';

interface CheckboxComponentProps {
  value: string;
  color?: 'primary' | 'secondary' | 'default';
  label: string;
}

const CheckboxComponent: React.FC<CheckboxComponentProps> = ({
  value,
  color = 'primary',
  label,
}) => {
  return (
    <FormControlLabel
      control={<Checkbox value={value} color={color} />}
      label={label}
    />
  );
};

export default CheckboxComponent;
