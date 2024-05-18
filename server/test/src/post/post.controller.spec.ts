import { AuthGuard } from 'src/auth/auth.guard';
import { HttpException } from '@nestjs/common';
import { PostController } from 'src/post/post.controller';
import { PostService } from 'src/post/post.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';

describe('PostController', () => {
  let postController: PostController;
  let userService: UserService;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            getAll: jest.fn(),
            getAllForUser: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
          }
        },
        {
          provide: UserService,
          useValue: {
            getById: jest.fn()
          }
        }
      ]
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: () => Promise.resolve(true)
      })
      .compile();

    postController = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
    userService = module.get<UserService>(UserService);
    postService = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(postController).toBeDefined();
  });

  describe('getAll', () => {
    it('should get all posts if no postId is provided', async () => {
      const mockedPosts = [{}, {}];
      // @ts-expect-error Mocked service
      postService.getAll.mockResolvedValue(mockedPosts);

      const result = await postController.getAll(null);

      expect(result).toEqual(mockedPosts);
      expect(postService.getAll).toHaveBeenCalled();
    });

    it('should get all posts for appropriate user if postId is valid', async () => {
      const userId = '60a7b41e85793e42a43e8147';
      const mockedPosts = [{}, {}];
      // @ts-expect-error Mocked service
      userService.getById.mockResolvedValue({});
      // @ts-expect-error Mocked service
      postService.getAllForUser.mockResolvedValue(mockedPosts);

      const result = await postController.getAll(userId);

      expect(userService.getById).toHaveBeenCalledWith(userId);
      expect(postService.getAllForUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockedPosts);
    });

    it('should throw 400 error if userId is invalid', async () => {
      const userId = 'invalidPostId';
      const errorMessage = 'Invalid user id';
      await expect(postController.getAll(userId)).rejects.toThrow(new HttpException(errorMessage, 400));
    });

    it('should throw 404 error if user is not found', async () => {
      const userId = '60a7b41e85793e42a43e8147';
      const errorMessage = 'User not found';
      // @ts-expect-error Mocked service
      userService.getById.mockResolvedValue(null);

      await expect(postController.getAll(userId)).rejects.toThrow(new HttpException(errorMessage, 404));
    });
  });

  describe('getById', () => {
    it('should get post by appropriate id', async () => {
      const mockedPost = {};
      // @ts-expect-error Mocked service
      postService.getById.mockResolvedValue(mockedPost);

      const result = await postController.getById('60a7b41e85793e42a43e8147');

      expect(result).toEqual(mockedPost);
      expect(postService.getById).toHaveBeenCalledWith('60a7b41e85793e42a43e8147');
    });

    it('should throw 400 error if postId is invalid', async () => {
      const postId = 'invalidPostId';
      await expect(postController.getById(postId)).rejects.toThrow(new HttpException('Invalid post id', 400));
    });

    it('should throw 404 error if post is not found', async () => {
      const postId = '60a7b41e85793e42a43e8147';
      // @ts-expect-error Mocked service
      postService.getById.mockResolvedValue(null);

      await expect(postController.getById(postId)).rejects.toThrow(new HttpException('Post not found', 404));
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const mockedPostDto = { message: 'test' };
      const mockedRequest = { user: { id: 'userId' } };
      // @ts-expect-error Mocked service
      userService.getById.mockResolvedValue({});
      // @ts-expect-error Mocked service
      postService.create.mockResolvedValue({});

      const result = await postController.create(mockedRequest, mockedPostDto);

      expect(result).toEqual({});
      expect(userService.getById).toHaveBeenCalledWith('userId');
      expect(postService.create).toHaveBeenCalledWith({ author: 'userId', ...mockedPostDto });
    });
  });
});
