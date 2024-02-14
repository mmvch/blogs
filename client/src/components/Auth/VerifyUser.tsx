import AuthService from '../../services/Auth.service';
import toast from 'react-hot-toast';
import { LoginService } from '../../services/Login.service';
import { useNavigate, useParams } from 'react-router-dom';

export default function VerifyUser() {
  const navigate = useNavigate();
  const { verificationToken } = useParams();

  if (verificationToken) {
    AuthService.verifyUser(verificationToken)
      .then((authToken) => {
        LoginService.login(authToken);
        toast.success('User comfirmation success');
      })
      .catch((error) => {
        navigate('/login');
        toast.error(error.message);
      });
  } else {
    navigate('/login');
  }

  return <></>;
}
