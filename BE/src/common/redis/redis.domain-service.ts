import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisDomainService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  async exists(key: string): Promise<number> {
    return this.redis.exists(key);
  }

  async get(key: string): Promise<string | number | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: number, expires?: number): Promise<'OK'> {
    if (expires) {
      return this.redis.set(key, value, 'EX', expires);
    }
    return this.redis.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    return this.redis.zadd(key, score, member);
  }

  async zcard(key: string): Promise<number> {
    return this.redis.zcard(key);
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redis.zrange(key, start, stop);
  }

  async zremrangebyrank(
    key: string,
    start: number,
    stop: number,
  ): Promise<number> {
    return this.redis.zremrangebyrank(key, start, stop);
  }

  async zrevrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redis.zrevrange(key, start, stop);
  }

  async zrevrank(key: string, member: string): Promise<number | null> {
    return this.redis.zrevrank(key, member);
  }

  async zrem(key: string, member: string): Promise<number> {
    return this.redis.zrem(key, member);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return this.redis.expire(key, seconds);
  }

  async publish(channel: string, message: string) {
    return this.redis.publish(channel, message);
  }

  async subscribe(channel: string) {
    await this.redis.subscribe(channel);
  }

  on(callback: (message: string) => void) {
    this.redis.on('message', (message) => {
      callback(message);
    });
  }

  async unsubscribe(channel: string) {
    return this.redis.unsubscribe(channel);
  }

  async increment(key: string) {
    return this.redis.incr(key);
  }

  async decrement(key: string) {
    return this.redis.decr(key);
  }
}
