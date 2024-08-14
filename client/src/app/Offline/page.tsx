import  Box from '@mui/material/Box';
import  Typography from '@mui/material/Typography';
import  Container from '@mui/material/Container';

export default function Offline() {
  return (
    <Container
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h1" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '3rem', lg: '4rem' } }}>
        You are offline
      </Typography>
      <Typography variant="h6" component="p" fontWeight="medium" sx={{ fontSize: { xs: '1.5rem', lg: '2rem' }, mt: 2 }}>
        Connect to internet and try again
      </Typography>
    </Container>
  );
}
