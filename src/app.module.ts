import { Module } from '@nestjs/common';
import { UserService, UserModule, UserController } from '@/user';
import { AuthModule } from '@/auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, PrismaService],
})
export class AppModule {}
