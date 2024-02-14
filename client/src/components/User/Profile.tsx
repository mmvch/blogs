import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useUser from '../../contexts/user-context/useUser';
import { Avatar, Box, Paper, Typography } from '@mui/material';

export default function UserProfile() {
  const avatarSize: number = 300;
  const { user } = useUser();

  return (
    <Paper
      sx={{
        padding: 4,
        margin: 'auto',
        maxWidth: 500
      }}
      elevation={3}
    >
      <Avatar sx={{ bgcolor: 'lightskyblue', width: avatarSize, height: avatarSize, margin: 'auto' }}>
        <AccountCircleIcon sx={{ fontSize: avatarSize }} />
      </Avatar>
      <Box textAlign="center" mt={6}>
        <Typography variant="h6">{user?.username}</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {user?.id}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Information...
        </Typography>
      </Box>
    </Paper>
  );
}
