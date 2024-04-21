import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '@/user';
import { SignInBodyType, SignUpBodyType, Role } from '@/types';
import { mappingCreateUserData } from '@/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signInHandler(password: string, user: User) {
    const isMatchPassword = await bcrypt.compare(password, user?.hashPassword);

    if (!isMatchPassword || !user) {
      throw new BadRequestException('not_valid_credentials');
    }

    const payload = { user };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }

  async signIn(body: SignInBodyType) {
    const { password, email } = body;
    const users: User[] = await this.userService.findAll({ email });
    const currentUser = users?.[0] ?? null;

    return this.signInHandler(password, currentUser);
  }

  async signUp(body: SignUpBodyType) {
    const { password, email, name } = body;

    const role: Role = 'USER';
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const users: User[] = await this.userService.findAll({ email });
    if (users?.length) {
      throw new BadRequestException('user_already_created');
    }

    const createUserPayload = mappingCreateUserData(body, {
      role,
      hashPassword,
    });

    const newUser = await this.userService.create(createUserPayload);

    if (!newUser.id) {
      throw new InternalServerErrorException('user_not_created');
    }

    return this.signInHandler(body.password, newUser);
  }
}
