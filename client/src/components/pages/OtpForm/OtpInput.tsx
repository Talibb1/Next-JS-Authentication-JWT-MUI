import React from 'react';
import { TextField, Grid } from '@mui/material';

interface OtpInputProps {
  digit: string;
  index: number;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  error: boolean;
  handleChange: (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ digit, index, inputRefs, error, handleChange, handleKeyDown }) => {
  return (
    <Grid item xs={3} sm={2}>
      <TextField
        inputRef={(el) => (inputRefs.current[index] = el)}
        variant="outlined"
        inputProps={{
          maxLength: 1,
          style: {
            textAlign: 'center',
            fontSize: '2rem',
            height: '2rem',
          },
        }}
        value={digit}
        onChange={handleChange(index)}
        onKeyDown={handleKeyDown(index)}
        error={error && digit === ''}
        helperText={error && digit === '' ? '' : ''}
      />
    </Grid>
  );
};

export default OtpInput;
