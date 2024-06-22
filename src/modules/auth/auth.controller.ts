import { Body, Controller, HttpCode, Post, Put } from '@nestjs/common';
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
  login(@Body() body: SignInBodyType) {
    return this.authService.signIn(body);
  }

  @HttpCode(201)
  @Post('signup')
  registration(@Body() body: SignUpBodyType) {
    return this.authService.signUp(body);
  }

  @Put('change')
  changePassword(@Body() body: ChangePasswordBodyType) {
    return this.authService.changePassword(body);
  }
}
