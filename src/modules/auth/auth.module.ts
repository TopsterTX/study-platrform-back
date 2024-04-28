import { Module } from '@nestjs/common';
import { UserService } from 'src/modules/user';
import { PrismaService } from '@/prisma.service';
import { JwtModule, AuthService, AuthController } from '@/modules';
import {} from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService],
})
export class AuthModule {}
