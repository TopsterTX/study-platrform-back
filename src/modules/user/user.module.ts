import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { UserService, JwtModule, UserController } from '@/modules';

@Module({
  imports: [JwtModule],
  controllers: [UserController],
  providers: [PrismaService, UserService],
})
export class UserModule {}
