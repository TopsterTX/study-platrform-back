import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '@/modules/user/user.service';
import {
  SignInBodyType,
  SignUpBodyType,
  ChangePasswordBodyType,
} from '@/modules';
import { mappingCreateUserData } from 'src/utils';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async getHashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async createAccessToken(password: string, user: User, response: Response) {
    const isMatchPassword = await bcrypt.compare(password, user?.hashPassword);

    if (!isMatchPassword || !user) {
      throw new BadRequestException('not_valid_credentials');
    }

    const payload = user;
    const token = await this.jwtService.signAsync(payload);

    response.cookie('access_token', token, {
      httpOnly: true,
    });
  }

  async signIn(body: SignInBodyType, response: Response) {
    const { password, email } = body;
    const users: User[] = await this.userService.findAll({ email });
    const currentUser = users?.[0] ?? null;

    return this.createAccessToken(password, currentUser, response);
  }

  async signUp(body: SignUpBodyType, response: Response) {
    const { password, email, role, name } = body;

    const sameEmailUsers: User[] = await this.userService.findAll({ email });
    const sameNameUsers: User[] = await this.userService.findAll({ name });
    if (sameEmailUsers?.length) {
      throw new BadRequestException('email_already_use');
    }
    if (sameNameUsers?.length) {
      throw new BadRequestException('username_already_use');
    }

    const hashPassword = await this.getHashPassword(password);

    const createUserPayload = mappingCreateUserData(body, {
      role,
      hashPassword,
    });

    const newUser = await this.userService.create(createUserPayload);

    if (!newUser.id) {
      throw new InternalServerErrorException('user_not_created');
    }

    return this.createAccessToken(body.password, newUser, response);
  }

  async changePassword(body: ChangePasswordBodyType) {
    const { password: newPassword, email, secret } = body;

    const users = await this.userService.findAll({ email });
    const currentUser = users?.[0];
    if (!currentUser) {
      throw new BadRequestException('user_not_found');
    }

    const isMatchSecret = currentUser.secret === secret;
    if (!isMatchSecret) {
      throw new BadRequestException('secret_not_valid');
    }

    const newHashPassword = await this.getHashPassword(newPassword);

    return await this.userService.update(currentUser.id, {
      hashPassword: newHashPassword,
    });
  }
}
