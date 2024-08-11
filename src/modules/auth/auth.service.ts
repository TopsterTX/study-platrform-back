import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
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
import {
  defaultResponse,
  mappingCreateUserData,
  TokenDecoder,
} from 'src/utils';
import { Response } from 'express';
import { CustomRequest } from '@/types';

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

  async isMatchPassword(password: string, hashPassword: string) {
    try {
      return await bcrypt.compare(password, hashPassword);
    } catch (_) {
      throw new BadRequestException('compare_password_error');
    }
  }

  async isExpiredToken(token: string) {
    try {
      const verifiedToken = await this.jwtService.verify(token);
      return Boolean(new Date(verifiedToken.exp * 1000) < new Date());
    } catch (_) {
      throw new BadRequestException('verify_token_error');
    }
  }

  async createAccessRefreshToken(user: User, response: Response) {
    const payload = {
      id: user.id,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1w',
    });

    response.cookie('access_token', accessToken, {
      httpOnly: true,
    });
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });

    return defaultResponse(true);
  }

  async signIn(body: SignInBodyType, response: Response) {
    const { password, email } = body;
    const users: User[] = await this.userService.findAll({ email });
    const currentUser = users?.[0] ?? null;

    if (!(await this.isMatchPassword(password, currentUser.hashPassword))) {
      throw new BadRequestException('not_valid_credentials');
    }
    return this.createAccessRefreshToken(currentUser, response);
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

    return this.createAccessRefreshToken(newUser, response);
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

    const { id } = await this.userService.update(currentUser.id, {
      hashPassword: newHashPassword,
    });

    if (!id) {
      throw new BadRequestException('user_not_updated');
    }

    return defaultResponse(Boolean(id));
  }

  async refreshToken(request: CustomRequest, response: Response) {
    const refreshToken = TokenDecoder.getRawTokenFromCookie(
      request.cookies.refresh_token,
    );

    if (await this.isExpiredToken(refreshToken)) {
      throw new NotAcceptableException('token_expired');
    }
    return this.createAccessRefreshToken(request.user, response);
  }

  async logout(response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    return defaultResponse(true);
  }
}
