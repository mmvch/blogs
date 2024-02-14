import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Post from '../../models/Post';
import toast from 'react-hot-toast';
import Typography from '@mui/material/Typography';
import useUser from '../../contexts/user-context/useUser';
import { Button, CardActions, CardHeader, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PostCard({ post, onDelete }: { post: Post; onDelete: (postId: string) => void }) {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <Card sx={{ width: '35%' }}>
      <CardHeader
        title={post.author?.username}
        subheader={new Date(post.createdAt!).toLocaleString('uk-UA')}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.message}
        </Typography>
      </CardContent>
      <CardActions>
        {post.author?._id === user?.id && (
          <Grid container>
            <Button size="small" onClick={() => onDelete(post._id!)}>
              Delete
            </Button>
            <Button
              size="small"
              onClick={() => {
                toast.error('Not implemented');
              }}
            >
              Update
            </Button>
          </Grid>
        )}
        <Grid container justifyContent="flex-end" flex={1}>
          <Button
            size="small"
            onClick={() => {
              navigate(`/posts/${post._id}/comments`);
            }}
          >
            Comments
          </Button>
        </Grid>
      </CardActions>
    </Card>
  );
}
