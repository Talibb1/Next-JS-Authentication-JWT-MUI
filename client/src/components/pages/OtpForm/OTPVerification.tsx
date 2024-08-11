// import { Container, Grid } from "@mui/material";
// import OtpForm from "./OtpForm";
// import Image from "next/image";

// const OTPVerificationPage: React.FC = () => {
//   return (
//     <Container maxWidth="lg" style={{ paddingTop: "1rem" }}>
//       <Grid container spacing={2}>
//         <Grid item xs={12} md={6}>
//           <Image
//             src="/assets/images/otp.svg"
//             alt="Illustration"
//             width={700}
//             height={500}
//             priority={true} // Add the priority property
//           />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <OtpForm />
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default OTPVerificationPage;
"use client";

import React from "react";
import { Container, Grid, useMediaQuery, useTheme } from "@mui/material";
import OtpForm from "./OtpForm";
import Image from "next/image";

const OTPVerificationPage: React.FC = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Container maxWidth="lg" style={{ paddingTop: "1rem" }}>
      <Grid container spacing={2} direction={{ xs: "column", md: "row" }}>
        {isLargeScreen && (
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Image
              src="assets/otp.svg"
              alt="Illustration"
              width={550} 
              height={500}
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <OtpForm />
        </Grid>
      </Grid>
    </Container>
  );
};

export default OTPVerificationPage;
