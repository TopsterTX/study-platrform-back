import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(name: string, password: string) {
    const user = this.userService.findByName(name);
    if (user.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { user };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
