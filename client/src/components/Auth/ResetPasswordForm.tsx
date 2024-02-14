import AuthService from '../../services/Auth.service';
import toast from 'react-hot-toast';
import { Box, Button, Container, CssBaseline, IconButton, TextField, Typography } from '@mui/material';
import { FormEvent, useState } from 'react';
import { LoginService } from '../../services/Login.service';
import { useNavigate, useParams } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const { resetToken } = useParams();

  const [isConfirmationError, setIsConfirmationError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setIsConfirmationError(false);
    setValidationErrors([]);

    if (data.get('password')?.toString() !== data.get('confirmPassword')?.toString()) {
      setIsConfirmationError(true);
      return;
    }

    try {
      if (resetToken) {
        AuthService.resetPassword(resetToken, data.get('password')?.toString() ?? '')
          .then((authToken) => {
            LoginService.login(authToken);
            toast.success('Reset password success');
          })
          .catch((error) => {
            toast.error(error.message);
          });
      } else {
        navigate('/login');
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
        <Typography component="h1" variant="h5">
          Reset Password
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
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              )
            }}
            error={isConfirmationError}
            helperText={isConfirmationError ? 'Password and Confirm Password does not match' : null}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, bgcolor: 'indigo' }}>
            Reset
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
