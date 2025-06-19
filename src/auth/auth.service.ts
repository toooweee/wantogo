import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import AuthDto from './dto/auth.dto';
import * as argon from 'argon2';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: AuthDto) {
    const hashedPassword = await argon.hash(registerDto.password);

    try {
      const user = await this.usersService.create({
        ...registerDto,
        password: hashedPassword,
      });

      if (user) {
        const { password, ...result } = user;

        return result;
      }
    } catch (e) {
      if (e?.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException('User already exists');
      }

      console.log(e);
      throw new BadRequestException('Something went wrong');
    }
  }

  async login(loginDto: AuthDto) {
    try {
      const user = await this.usersService.findByEmail(loginDto.email);
      await this.comparePassword(user.password, loginDto.password);
      return {
        ...user,
        password: undefined,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = await this.jwtService.signAsync(payload);
    const expirationTime = this.configService.get('JWT_EXPIRATION_TIME');
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.transformAgeToMS(expirationTime)}`;
  }

  transformAgeToMS(time: string) {
    return parseInt(time) * 60 * 1000;
  }

  private async comparePassword(hashedPassword: string, password: string) {
    const isPasswordMatching = await argon.verify(hashedPassword, password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
