import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// TODO move secret to .env
const JWT_SECRET = 'secret';

@Module({
  imports: [JwtModule.register({ secret: JWT_SECRET })],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
