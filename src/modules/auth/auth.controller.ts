import {
  Body,
  Controller,
  HttpCode,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ChangePasswordBodyType,
  SignInBodyType,
  SignUpBodyType,
} from '@/modules';
import { AuthService } from './auth.service';
import { CustomRequest } from '@/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('signin')
  login(
    @Body() body: SignInBodyType,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signIn(body, response);
  }

  @HttpCode(201)
  @Post('signup')
  registration(
    @Body() body: SignUpBodyType,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signUp(body, response);
  }

  @Put('change')
  changePassword(@Body() body: ChangePasswordBodyType) {
    return this.authService.changePassword(body);
  }

  @HttpCode(200)
  @Post('refresh')
  refreshToken(
    @Req() request: CustomRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshToken(request, response);
  }

  @HttpCode(200)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}
