import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Comment from '../../models/Comment';
import toast from 'react-hot-toast';
import Typography from '@mui/material/Typography';
import useUser from '../../contexts/user-context/useUser';
import { Button, CardActions, CardHeader, Grid } from '@mui/material';

export default function CommentCard({
  comment,
  onDelete
}: {
  comment: Comment;
  onDelete: (commentId: string) => void;
}) {
  const { user } = useUser();
  return (
    <Card sx={{ width: '35%' }}>
      <CardHeader
        title={comment.author?.username}
        subheader={new Date(comment.createdAt!).toLocaleString('uk-UA')}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {comment.message}
        </Typography>
      </CardContent>
      <CardActions>
        {comment.author?._id === user?.id && (
          <Grid container>
            <Button size="small" onClick={() => onDelete(comment._id!)}>
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
      </CardActions>
    </Card>
  );
}
