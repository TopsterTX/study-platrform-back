import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenDecoder {
  constructor() {}

  static getRawTokenFromHeader(header: string) {
    const [, token] = header.split(' ');
    return token;
  }

  static getRawTokenFromCookie(cookie: string) {
    const [, token] = cookie.split('=');
    return token;
  }
}
