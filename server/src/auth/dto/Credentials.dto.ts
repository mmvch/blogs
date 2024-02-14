import { IsEmail, IsString, Length } from 'class-validator';

export class LoginCredentials {
  @Length(4, 10)
  @IsString()
  username: string;

  @Length(4, 10)
  @IsString()
  password: string;
}

export class RegisterCredentials {
  @Length(4, 10)
  @IsString()
  username: string;

  @Length(4, 10)
  @IsString()
  password: string;

  @IsEmail()
  email: string;
}
