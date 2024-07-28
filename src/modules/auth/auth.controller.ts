import { Body, Controller, HttpCode, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import {
  ChangePasswordBodyType,
  SignInBodyType,
  SignUpBodyType,
} from '@/modules';
import { AuthService } from './auth.service';

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
}
