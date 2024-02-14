import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import User from '../../models/User';
import { Avatar, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function UserCard(user: User) {
  const avatarSize: number = 160;
  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 'fit-content' }}>
      <CardActionArea
        onClick={() => {
          navigate(`/blogs/${user._id}`);
        }}
      >
        <Avatar sx={{ bgcolor: 'lightskyblue', width: avatarSize, height: avatarSize, margin: 2 }}>
          <AccountCircleIcon sx={{ fontSize: avatarSize }} />
        </Avatar>
        <CardContent>
          <Typography sx={{ display: 'flex', justifyContent: 'center' }} variant="h5">
            {user.username}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
