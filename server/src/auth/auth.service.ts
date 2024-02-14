import * as bcrypt from 'bcrypt';
import MailDto from './dto/Mail.dto';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginCredentials, RegisterCredentials } from './dto/Credentials.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/_schemas/User.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async validateNewUser(credentials: RegisterCredentials): Promise<void> {
    if (await this.userService.getByName(credentials.username)) {
      throw new Error('Username already in use');
    }

    if (await this.userService.getOne({ email: credentials.email })) {
      throw new Error('Email already in use');
    }
  }

  async validateUser(credentials: LoginCredentials): Promise<User> {
    const user = await this.userService.getByName(credentials.username);
    if (!user) {
      throw new Error('Invalid username');
    }

    if (!(await bcrypt.compare(credentials.password, user.passwordHash))) {
      throw new Error('Invalid password');
    }

    if (!user.verified) {
      this.sendVerificationMail(user);
      throw new Error('You need to confirm your email address');
    }

    return user;
  }

  async sendVerificationMail(user: User): Promise<void> {
    const token = await this.jwtService.signAsync(
      { username: user.username },
      { expiresIn: '5m', secret: this.configService.get<string>('JWT_VERIFY_USER_SECRET_KEY') }
    );

    const mailDto = {
      to: user.email,
      subject: 'Blogs: Account Confirmation',
      text: `${this.configService.get<string>('ALLOWED_ORIGIN')}/verify-user/${token}`
    };

    this.sendMail(mailDto);
  }

  async sendResetPasswordMail(user: User): Promise<void> {
    const token = await this.jwtService.signAsync(
      { username: user.username },
      { expiresIn: '5m', secret: this.configService.get<string>('JWT_RESET_PASSWORD_SECRET_KEY') }
    );

    const mailDto = {
      to: user.email,
      subject: 'Blogs: Password Reset',
      text: `${this.configService.get<string>('ALLOWED_ORIGIN')}/reset-password/${token}`
    };

    this.sendMail(mailDto);
  }

  private async sendMail(mailDto: MailDto): Promise<void> {
    try {
      await this.mailerService.sendMail(mailDto);
    } catch (error) {
      console.log(error.message);
    }
  }
}
