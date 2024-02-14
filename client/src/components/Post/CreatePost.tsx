import Post from '../../models/Post';
import React, { useState } from 'react';
import { Box, Button, Grid, TextField } from '@mui/material';

export default function CreatePost({ onCreate }: { onCreate: (post: Post) => void }) {
  const [content, setContent] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (content.trim() !== '') {
      const post = { message: content };
      onCreate(post);
      setContent('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container columnSpacing={2} alignItems="flex-end" justifyContent="center">
        <Grid item xs={4}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="What's on your mind?"
            variant="outlined"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </Grid>
        <Grid item xs={1}>
          <Button type="submit" variant="contained" color="primary">
            Post
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
