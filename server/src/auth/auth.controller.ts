import * as bcrypt from 'bcrypt';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Body, Controller, HttpException, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IdentityUserDto } from './dto/IdentityUser.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginCredentials, RegisterCredentials } from './dto/Credentials.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() credentials: RegisterCredentials): Promise<void> {
    try {
      await this.authService.validateNewUser(credentials);

      const createUserDto = {
        username: credentials.username,
        email: credentials.email,
        passwordHash: await bcrypt.hash(credentials.password, 12)
      };

      const newUser = await this.userService.create(createUserDto);
      if (!!newUser) {
        this.authService.sendVerificationMail(newUser);
      }
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() credentials: LoginCredentials): Promise<string> {
    try {
      const user = await this.authService.validateUser(credentials);
      return await this.jwtService.signAsync({ id: user._id });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Post('verify-user')
  async verifyUser(@Body() data: { verificationToken: string }): Promise<string> {
    try {
      const { username } = await this.jwtService.verifyAsync(data.verificationToken, {
        secret: this.configService.get<string>('JWT_VERIFY_USER_SECRET_KEY')
      });

      if (!username) {
        throw new Error('Verification token is invalid');
      }

      const user = await this.userService.getByName(username);
      if (!!user) {
        this.userService.update(user._id, { verified: true });
        return await this.jwtService.signAsync({ id: user._id });
      } else {
        throw Error('Verification token is invalid');
      }
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Post('send-reset-password-link')
  async sendResetPasswordLink(@Body() credentials: { username: string }): Promise<void> {
    try {
      const user = await this.userService.getByName(credentials.username);
      if (!!user) {
        this.authService.sendResetPasswordMail(user);
      } else {
        throw new Error('Unknown user');
      }
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() data: { resetToken: string; password: string }): Promise<string> {
    try {
      const { username } = await this.jwtService.verifyAsync(data.resetToken, {
        secret: this.configService.get<string>('JWT_RESET_PASSWORD_SECRET_KEY')
      });

      if (!username) {
        throw new Error('Reset password token is invalid');
      }

      const user = await this.userService.getByName(username);
      if (!user) {
        throw new Error('Reset password token is invalid');
      } else if (!user.verified) {
        throw new Error('You need to confirm your email address');
      } else {
        const userForUpdate = {
          passwordHash: await bcrypt.hash(data.password, 12)
        };

        const updatedUser = await this.userService.update(user._id, userForUpdate);
        return await this.jwtService.signAsync({ id: updatedUser._id });
      }
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Post('get-identity-user')
  @UseGuards(AuthGuard)
  async getIdentityUser(@Request() request: any): Promise<IdentityUserDto> {
    try {
      const user = await this.userService.getById(request.user.id);

      if (!user.verified) {
        throw new Error('You need to confirm your email address');
      }

      const userDto = {
        id: user._id,
        username: user.username
      };

      return userDto;
    } catch (error) {
      throw new HttpException(error.message, 401);
    }
  }
}
