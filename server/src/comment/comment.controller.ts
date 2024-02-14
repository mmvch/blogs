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
import { CommentDto } from './dto/Comment.dto';
import { CommentService } from './comment.service';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly postService: PostService
  ) {}

  @Get()
  async getAll(@Query('postId') postId: string) {
    if (!!postId) {
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new HttpException('Invalid post id', 400);
      }

      if (!(await this.postService.getById(postId))) {
        throw new HttpException('Post not found', 404);
      }

      return this.commentService.getAllForPost(postId);
    }

    return this.commentService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid comment id', 400);
    }

    const comment = this.commentService.getById(id);
    if (!comment) {
      throw new HttpException('Comment not found', 404);
    }

    return comment;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Request() request: any, @Body() commentDto: CommentDto) {
    const author = request.user.id;

    if (!this.userService.getById(author)) {
      throw new HttpException('Unknown user', 401);
    }

    const createCommentDto = { author, ...commentDto };
    try {
      return await this.commentService.create(createCommentDto);
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Request() request: any, @Body() commentDto: CommentDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid comment id', 400);
    }

    const user = await this.userService.getById(request.user.id);
    if (!user) {
      throw new HttpException('Unknown user', 401);
    }

    try {
      return await this.commentService.update(id, commentDto, user);
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() request: any) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid comment id', 400);
    }

    const user = await this.userService.getById(request.user.id);
    if (!user) {
      throw new HttpException('Unknown user', 401);
    }

    try {
      return await this.commentService.delete(id, user);
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }
}
