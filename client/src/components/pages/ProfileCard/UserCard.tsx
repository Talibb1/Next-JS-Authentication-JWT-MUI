import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

interface UserCardProps {
  name: string;
  email: string;
  role: string;
  picture: string;
}

// Custom styled component for the card
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent background
  backdropFilter: 'blur(10px)', // Blur effect
  borderRadius: '15px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.3)',

  '&:hover': {
    transform: 'scale(1.05)', // Scale effect on hover
    boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.5)', // Increased shadow on hover
  },

  '& .MuiCardContent-root': {
    textAlign: 'center',
  },

  '& .MuiTypography-h5': {
    fontWeight: 600,
    color: theme.palette.primary.main,
  },

  '& .MuiTypography-body2': {
    color: theme.palette.text.secondary,
  },
}));

const UserCard: React.FC<UserCardProps> = ({ name, email, role, picture }) => {
  return (
    <StyledCard>
      <CardMedia
        component="img"
        alt={name}
        height="140"
        image={picture}
        sx={{ borderRadius: '15px 15px 0 0' }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Role: {role}
        </Typography>
      </CardContent>
    </StyledCard>
  );
}

export default UserCard;