import BlogsAppBar from './AppBar/BlogsAppBar';
import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="App">
      <BlogsAppBar />
      <Container maxWidth="xl" sx={{ marginTop: 12 }}>
        <Outlet />
      </Container>
    </div>
  );
}
