import Post from '../../models/Post';
import PostCard from './PostCard';
import { Grid, Typography } from '@mui/material';

export default function PostGrid({ posts, onDelete }: { posts: Post[]; onDelete: (postId: string) => void }) {
  return (
    <Grid container rowSpacing={3}>
      {posts.length === 0 && (
        <Typography sx={{ display: 'flex', justifyContent: 'center' }} variant="h5" width="100%">
          There are no posts yet. Sad...
        </Typography>
      )}
      {posts.map((post) => (
        <Grid item key={post._id} xs={12} display="flex" justifyContent="center">
          <PostCard post={post} onDelete={onDelete} />
        </Grid>
      ))}
    </Grid>
  );
}
