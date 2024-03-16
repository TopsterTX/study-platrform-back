import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { name: string; password: string }) {
    const { name, password } = body;
    return this.authService.login(name, password);
  }
}
