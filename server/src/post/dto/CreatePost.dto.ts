import { IsMongoId } from 'class-validator';
import { PostDto } from './Post.dto';

export class CreatePostDto extends PostDto {
  @IsMongoId()
  author: string;
}
