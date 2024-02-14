import { Comment, CommentSchema } from 'src/_schemas/Comment.schema';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/_schemas/Post.schema';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema
      },
      {
        name: Post.name,
        schema: PostSchema
      }
    ]),
    UserModule,
    PostModule
  ],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
