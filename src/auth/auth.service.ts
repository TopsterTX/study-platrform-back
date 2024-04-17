import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '@/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const users: User[] = await this.userService.findAll({ email });
    const currentUser = users?.[0] ?? null;

    const isMatchPassword = await bcrypt.compare(
      password,
      currentUser?.hashPassword,
    );

    if (!isMatchPassword || !currentUser) {
      throw new BadRequestException('not_valid_credentials');
    }

    const payload = { user: currentUser };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
