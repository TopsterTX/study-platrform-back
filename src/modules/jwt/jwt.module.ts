import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    NestJwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
})
export class JwtModule {}
