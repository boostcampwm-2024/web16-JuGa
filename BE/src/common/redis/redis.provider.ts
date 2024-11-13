import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();
export const RedisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    return new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
  },
};
