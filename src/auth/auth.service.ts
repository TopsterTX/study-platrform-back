import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(name: string, password: string) {
    const user: User = await this.userService.findByName(name);
    if (!user || user.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { user };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
