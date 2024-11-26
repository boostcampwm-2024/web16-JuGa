import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt', 'kakao']) {
  handleRequest(err, user) {
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return user;
    }

    throw err || new UnauthorizedException();
  }
}
