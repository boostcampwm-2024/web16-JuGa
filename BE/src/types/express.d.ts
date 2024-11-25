import { Request as Req } from 'express';
import { UUID } from 'crypto';

declare module 'express' {
  interface Request extends Req {
    user: {
      kakaoId?: string;
      userId?: UUID;
      email?: string;
      nickname?: string;
    };
  }
}
