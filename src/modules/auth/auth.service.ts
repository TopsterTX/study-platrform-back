import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'src/modules/user';
import {
  SignInBodyType,
  SignUpBodyType,
  Role,
  ChangePasswordBodyType,
} from '@/types';
import { mappingCreateUserData } from 'src/utils';

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

    const users: User[] = await this.userService.findAll({ email });
    if (users?.length) {
      throw new BadRequestException('user_already_created');
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

    return this.signInHandler(body.password, newUser);
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
