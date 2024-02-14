import { Comment } from 'src/_schemas/Comment.schema';
import { CommentDto } from './dto/Comment.dto';
import { CreateCommentDto } from './dto/CreateComment.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/_schemas/Post.schema';
import { User } from 'src/_schemas/User.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Post.name) private postModel: Model<Post>
  ) {}

  async getAll(): Promise<Comment[]> {
    return this.commentModel.find().sort({ createdAt: 'desc' }).populate('author').exec();
  }

  async getAllForPost(postId: string): Promise<Comment[]> {
    return this.commentModel.find({ post: postId }).sort({ createdAt: 'desc' }).populate('author').exec();
  }

  async getById(id: string): Promise<Comment> {
    return this.commentModel.findById(id).populate('author').exec();
  }

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const post = await this.postModel.findById(createCommentDto.post);
    if (!post) {
      throw new Error('Post not found');
    }

    const comment = new this.commentModel(createCommentDto);
    const createdComment = await comment.save();
    return createdComment.populate('author');
  }

  async update(id: string, commentDto: CommentDto, currentUser: User): Promise<Comment> {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.author.toString() !== currentUser._id.toString()) {
      throw new Error('You cannot update this comment');
    }

    return this.commentModel
      .findByIdAndUpdate(id, commentDto, {
        new: true
      })
      .exec();
  }

  async delete(id: string, currentUser: User): Promise<Comment> {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.author.toString() !== currentUser._id.toString()) {
      throw new Error('You cannot update this comment');
    }

    return this.commentModel.findByIdAndDelete(id).exec();
  }
}
