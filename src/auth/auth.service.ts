import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: AuthDto) {
    const hashedPassword = await argon.hash(registerDto.password);

    try {
      const createdUser = await this.usersService.create({
        ...registerDto,
        password: hashedPassword,
      });
      delete (createdUser as any).password;
      return createdUser;
    } catch (e) {
      if (e?.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException('User already exists');
      }

      console.log(e);

      throw new InternalServerErrorException(
        'Something went wrong via register',
      );
    }
  }

  async login(loginDto: AuthDto) {
    try {
      const user = await this.usersService.findOne(loginDto.email);
      await this.comparePassword(user.password, loginDto.password);
      delete (user as any).password;
      return user;
    } catch (e) {
      throw new BadRequestException('Invalid credentials');
    }
  }

  private async comparePassword(
    hashedPassword: string,
    password: string,
  ): Promise<boolean> {
    const isPasswordMatching = await argon.verify(hashedPassword, password);

    if (!isPasswordMatching) {
      throw new BadRequestException('Invalid credentials');
    }

    return isPasswordMatching;
  }
}
