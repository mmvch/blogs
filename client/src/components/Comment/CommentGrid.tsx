import Comment from '../../models/Comment';
import CommentCard from './CommentCard';
import { Grid } from '@mui/material';

export default function CommentGrid({
  comments,
  onDelete
}: {
  comments: Comment[];
  onDelete: (commentId: string) => void;
}) {
  return (
    <Grid container rowSpacing={3}>
      {comments.map((comment) => (
        <Grid item key={comment._id} xs={12} display="flex" justifyContent="center">
          <CommentCard comment={comment} onDelete={onDelete} />
        </Grid>
      ))}
    </Grid>
  );
}
