import AppBar from '@mui/material/AppBar';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BookIcon from '@mui/icons-material/Book';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useUser from '../../contexts/user-context/useUser';
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { LoginService } from '../../services/Login.service';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function BlogsAppBar() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar id="app">
      <Toolbar sx={{ bgcolor: 'indigo' }}>
        <IconButton
          size="medium"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Blogs
        </Typography>
      </Toolbar>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate(`/blogs/${user?.id}`);
          }}
          id="user-blog"
        >
          <ListItemIcon>
            <BookIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Blog</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate('/users');
          }}
        >
          <ListItemIcon>
            <PeopleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Users</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate('/profile');
          }}
        >
          <ListItemIcon>
            <AssignmentIndIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={LoginService.logout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
