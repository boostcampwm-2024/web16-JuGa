import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt', 'kakao']) {
  handleRequest(err, user, info) {
    if (user) {
      return user;
    }

    throw err || new UnauthorizedException();
  }
}
