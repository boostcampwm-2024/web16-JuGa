import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = User>(err: Error, user: TUser): TUser {
    return user;
  }
}
