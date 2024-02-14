import { IsMongoId } from 'class-validator';
import { CommentDto } from './Comment.dto';

export class CreateCommentDto extends CommentDto {
  @IsMongoId()
  author: string;
}
