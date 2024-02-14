import AuthService from '../../services/Auth.service';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import toast from 'react-hot-toast';
import Typography from '@mui/material/Typography';
import { FormEvent, useState } from 'react';
import { Grid, IconButton, Link } from '@mui/material';
import { LoginService } from '../../services/Login.service';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function SignIn() {
  const [username, setUsername] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const authToken = await AuthService.login({
        username: data.get('username')?.toString(),
        password: data.get('password')?.toString()
      });

      LoginService.login(authToken);
    } catch (error: any) {
      if (Array.isArray(error.message)) {
        setValidationErrors(error.message);
      } else {
        setValidationErrors([error.message]);
      }
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleForgotPassword = async (): Promise<void> => {
    try {
      if (!!username) {
        await AuthService.sendResetPasswordLink(username);
        toast.success('Reset password link sent');
      } else {
        setValidationErrors(['Username field is empty']);
      }
    } catch (error: any) {
      if (Array.isArray(error.message)) {
        setValidationErrors(error.message);
      } else {
        setValidationErrors([error.message]);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'indigo' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign-In
        </Typography>
        {validationErrors.length > 0 && (
          <Box>
            {validationErrors.map((error, index) => (
              <Typography key={index} sx={{ color: 'red', fontSize: 14 }}>
                • {error}
              </Typography>
            ))}
          </Box>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            name="username"
            label="Username"
            value={username}
            onChange={handleUsernameChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              )
            }}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, bgcolor: 'indigo' }}>
            Sign In
          </Button>
          <Grid container sx={{ mt: 1 }}>
            <Grid item xs>
              <Link variant="body2" onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
