import { Module } from '@nestjs/common';
import {
  AuthController,
  AuthModule,
  AuthService,
  UserService,
  UserModule,
  UserController,
  JwtModule,
} from '@/modules';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [JwtModule, ConfigModule.forRoot()],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService, PrismaService, AuthService],
})
export class AppModule {}
