"use client";

import { Button } from "@mui/material";

interface ButtonComponentProps {
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  variant?: "text" | "outlined" | "contained";
  children: React.ReactNode;
  sx?: object;
  isSubmitting?: boolean; // Add the isSubmitting prop
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  type = "button",
  fullWidth = false,
  variant = "contained",
  children,
  sx = {},
  isSubmitting = false, // Default value for isSubmitting
}) => {
  return (
    <Button
      type={type}
      fullWidth={fullWidth}
      variant={variant}
      sx={sx}
      disabled={isSubmitting} 
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;
