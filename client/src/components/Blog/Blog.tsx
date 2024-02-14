import CreatePost from '../Post/CreatePost';
import Post from '../../models/Post';
import PostGrid from '../Post/PostGrid';
import PostService from '../../services/Post.service';
import toast from 'react-hot-toast';
import useUser from '../../contexts/user-context/useUser';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);

  const navigate = useNavigate();
  const { user } = useUser();
  const { userId } = useParams();

  useEffect(() => {
    PostService.getAllForUser(userId!)
      .then((posts) => setPosts(posts))
      .catch((error) => {
        toast.error(error.message);
        navigate('/users');
      });
  }, [userId]);

  const handleDeletePost = (postId: string) => {
    PostService.delete(postId)
      .then(() => {
        setPosts(posts.filter((post) => post._id !== postId));
        toast.success('Successfully deleted');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleCreatePost = (post: Post) => {
    PostService.create(post)
      .then((newPost) => {
        setPosts([newPost, ...posts]);
        toast.success('Successfully created');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <Stack spacing={2}>
      {userId === user?.id && <CreatePost onCreate={handleCreatePost} />}
      <PostGrid posts={posts} onDelete={handleDeletePost} />
    </Stack>
  );
}
