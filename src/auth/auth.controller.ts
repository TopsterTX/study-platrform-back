import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordBodyType,
  SignInBodyType,
  SignUpBodyType,
} from '@/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  login(@Body() body: SignInBodyType) {
    return this.authService.signIn(body);
  }

  @Post('signup')
  registration(@Body() body: SignUpBodyType) {
    return this.authService.signUp(body);
  }

  @Put('change')
  changePassword(@Body() body: ChangePasswordBodyType) {
    return this.authService.changePassword(body);
  }
}
