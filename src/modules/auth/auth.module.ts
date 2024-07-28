import { Module } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { PrismaService } from '@/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {} from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService],
})
export class AuthModule {}
