// src/common/redis/redis.module.ts
import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisDomainService } from './redis.domain-service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || 'redis',
          port: Number(process.env.REDIS_PORT || 6379),
        });
      },
    },
    {
      provide: 'REDIS_PUBLISHER',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || 'redis',
          port: Number(process.env.REDIS_PORT || 6379),
        });
      },
    },
    {
      provide: 'REDIS_SUBSCRIBER',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || 'redis',
          port: Number(process.env.REDIS_PORT || 6379),
        });
      },
    },
    RedisDomainService,
  ],
  exports: [RedisDomainService, 'REDIS_CLIENT'],
})
export class RedisModule {}
