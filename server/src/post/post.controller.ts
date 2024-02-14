import mongoose from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { PostDto } from './dto/Post.dto';
import { PostService } from './post.service';
import { UserService } from 'src/user/user.service';

@Controller('posts')
@UseGuards(AuthGuard)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService
  ) {}

  @Get()
  async getAll(@Query('userId') userId: string) {
    if (!!userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new HttpException('Invalid user id', 400);
      }

      if (!(await this.userService.getById(userId))) {
        throw new HttpException('User not found', 404);
      }

      return this.postService.getAllForUser(userId);
    }

    return this.postService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid post id', 400);
    }

    const post = await this.postService.getById(id);
    if (!post) {
      throw new HttpException('Post not found', 404);
    }

    return post;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Request() request: any, @Body() postDto: PostDto) {
    const author = request.user.id;

    if (!this.userService.getById(author)) {
      throw new HttpException('Unknown user', 401);
    }

    const createPostDto = { author, ...postDto };
    return this.postService.create(createPostDto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Request() request: any, @Body() postDto: PostDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid post id', 400);
    }

    const user = await this.userService.getById(request.user.id);
    if (!user) {
      throw new HttpException('Unknown user', 401);
    }

    try {
      return await this.postService.update(id, postDto, user);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() request: any) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid post id', 400);
    }

    const user = await this.userService.getById(request.user.id);
    if (!user) {
      throw new HttpException('Unknown user', 401);
    }

    try {
      return await this.postService.delete(id, user);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
