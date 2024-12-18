import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisDomainService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @Inject('REDIS_PUBLISHER') private readonly publisher: Redis,
    @Inject('REDIS_SUBSCRIBER') private readonly subscriber: Redis,
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
    return this.publisher.publish(channel, message);
  }

  async subscribe(channel: string) {
    await this.subscriber.subscribe(channel);
  }

  on(callback: (channel: string, message: string) => void) {
    this.subscriber.on('message', (channel, message) => {
      callback(channel, message);
    });
  }

  async unsubscribe(channel: string) {
    return this.subscriber.unsubscribe(channel);
  }

  async setConnection(key: string, value: number) {
    return this.redis.set(`connections:${key}`, value);
  }

  async getConnection(key: string): Promise<number> {
    return Number(await this.redis.get(`connections:${key}`));
  }

  async delConnection(key: string) {
    return this.redis.del(`connections:${key}`);
  }

  async existsConnection(key: string) {
    return this.redis.exists(`connections:${key}`);
  }

  async increment(key: string) {
    return this.redis.incr(`connections:${key}`);
  }

  async decrement(key: string) {
    return this.redis.decr(`connections:${key}`);
  }
}
