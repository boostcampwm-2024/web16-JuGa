import { Request as Req } from 'express';

declare module 'express' {
  interface Request extends Req {
    user: {
      kakaoId?: string;
      userId?: string;
      email?: string;
      nickname?: string;
    };
  }
}
