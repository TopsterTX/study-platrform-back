import { Module } from '@nestjs/common';
import {
  ArticleModule,
  AuthModule,
  CommentModule,
  TagModule,
  UserModule,
} from '@/modules';
import { AppService } from '@/app.service';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from '@/app.controller';
import { PrismaService } from '@/prisma.service';

// TODO  Разобраться с импортами и экспортами модулей
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    UserModule,
    AuthModule,
    CommentModule,
    TagModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
