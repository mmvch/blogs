import { createUserMock } from '../../utils';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from 'src/_schemas/Post.schema';
import { PostService } from 'src/post/post.service';
import { Test, TestingModule } from '@nestjs/testing';

const createMockMongooseModel = () => {
  const mockMongooseModel = function () {
    return mockMongooseModel;
  };

  mockMongooseModel.find = jest.fn();
  mockMongooseModel.findById = jest.fn();
  mockMongooseModel.findByIdAndUpdate = jest.fn();
  mockMongooseModel.findByIdAndDelete = jest.fn();
  mockMongooseModel.save = jest.fn();

  return mockMongooseModel;
};

describe('PostService', () => {
  let service: PostService;
  const mockPostModel = createMockMongooseModel();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getModelToken(Post.name),
          useValue: mockPostModel
        }
      ]
    }).compile();

    service = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of posts', async () => {
      const mockPosts = [{}, {}] as Post[];
      mockPostModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockPosts)
          })
        })
      });

      const result = await service.getAll();

      expect(result).toEqual(mockPosts);
    });
  });

  describe('getAllForUser', () => {
    it('should return an array of posts for the appropriate user', async () => {
      const userId = 'userId';
      const mockPosts = [{}, {}] as Post[];
      mockPostModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockPosts)
          })
        })
      });

      const result = await service.getAllForUser(userId);

      expect(mockPostModel.find).toHaveBeenCalledWith({ author: userId });
      expect(result).toEqual(mockPosts);
    });
  });

  describe('getById', () => {
    it('should return the appropriate post', async () => {
      const postId = 'postId';
      const mockPost = { _id: postId, author: 'user', message: 'description' } as Post;
      mockPostModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockPost)
        })
      });

      const result = await service.getById(postId);

      expect(result).toEqual(mockPost);
      expect(mockPostModel.findById).toHaveBeenCalledWith(postId);
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const CreatePostDto = { author: 'user', message: 'description' };
      const mockSavedPost = { _id: 'postId', ...CreatePostDto };
      mockPostModel.save.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockSavedPost)
      });

      const result = await service.create(CreatePostDto);
      expect(result).toEqual(mockSavedPost);
    });
  });

  describe('update', () => {
    it('should update the appropriate post', async () => {
      const postId = 'postId';
      const postDto = { message: 'new description' };
      const currentUser = createUserMock('userId');
      const mockPost = { _id: postId, author: currentUser._id } as Post;
      mockPostModel.findById.mockResolvedValue(mockPost);
      mockPostModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockPost, ...postDto })
      });

      const result = await service.update(postId, postDto, currentUser);

      expect(mockPostModel.findById).toHaveBeenCalledWith(postId);
      expect(mockPostModel.findByIdAndUpdate).toHaveBeenCalledWith(postId, postDto, { new: true });
      expect(result).toEqual({ ...mockPost, ...postDto });
    });

    it('should throw an error if post is not found', async () => {
      const postId = 'postId';
      const postDto = { message: 'new description' };
      const currentUser = createUserMock('userId');
      mockPostModel.findById.mockReturnValue(null);

      await expect(service.update(postId, postDto, currentUser)).rejects.toThrow('Post not found');
      expect(mockPostModel.findById).toHaveBeenCalledWith(postId);
    });

    it('should throw an error if user is not authorized to update the post', async () => {
      const postId = 'postId';
      const postDto = { message: 'new description' };
      const currentUser = createUserMock('userId');
      const mockPost = { _id: postId, author: 'authorId' } as Post;
      mockPostModel.findById.mockResolvedValue(mockPost);

      await expect(service.update(postId, postDto, currentUser)).rejects.toThrow('You cannot update this post');
      expect(mockPostModel.findById).toHaveBeenCalledWith(postId);
    });
  });

  describe('delete', () => {
    it('should delete the appropriate post', async () => {
      const postId = 'postId';
      const currentUser = createUserMock('userId');
      const mockPost = { _id: postId, author: currentUser._id } as Post;
      mockPostModel.findById.mockResolvedValue(mockPost);
      mockPostModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPost)
      });

      const result = await service.delete(postId, currentUser);

      expect(mockPostModel.findById).toHaveBeenCalledWith(postId);
      expect(mockPostModel.findByIdAndDelete).toHaveBeenCalledWith(postId);
      expect(result).toEqual(mockPost);
    });

    it('should throw an error if post is not found', async () => {
      const postId = 'postId';
      const currentUser = createUserMock('userId');
      mockPostModel.findById.mockResolvedValue(null);

      await expect(service.delete(postId, currentUser)).rejects.toThrow('Post not found');
      expect(mockPostModel.findById).toHaveBeenCalledWith(postId);
      expect(mockPostModel.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it('should throw an error if user is not authorized to delete the post', async () => {
      const postId = 'postId';
      const currentUser = createUserMock('userId');
      const mockPost = { _id: postId, author: 'authorId' } as Post;
      mockPostModel.findById.mockResolvedValue(mockPost);

      await expect(service.delete(postId, currentUser)).rejects.toThrow('You cannot delete this post');
      expect(mockPostModel.findById).toHaveBeenCalledWith(postId);
      expect(mockPostModel.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });
});
