import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  constructor(private jwt: JwtService) {}
  private redisCli: Redis;
  onModuleInit() {
    this.redisCli = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    this.redisCli.on('connect', () => {
      console.log('Redis connected successfully!✅');
    });
    this.redisCli.on('error', (err) => {
      console.log('❌Redis connection error: ', err);
    });
  }
  async get(key: string) {
    return await this.redisCli.get(key);
  }
  async set(key: string, value: unknown, expire?: number) {
    if (expire)
      return await this.redisCli.set(key, JSON.stringify(value), 'EX', expire);
    else return await this.redisCli.set(key, JSON.stringify(value));
  }
  async del(key: string) {
    return await this.redisCli.del(key);
  }

  async delWithPrefix(prefix: string) {
    const keys = await this.redisCli.keys(`${prefix}*`);
    if (keys.length) return await this.redisCli.del(keys);
  }
  async addTokenToTheBlackList(token: string, username: string) {
    const decoded: any = await this.jwt.decode(token);
    const tokenExpiry = decoded.exp * 1000;

    // Calculate the remaining time to live (TTL) for the token.
    const currentTime = Date.now();
    const ttl = tokenExpiry - currentTime;
    if (ttl > 0) {
      return await this.redisCli.set(
        `blacklist:${token}:${username}`,
        token,
        'PX',
        ttl,
      );
    }
  }
  async getFromBlackList(token: string, username: string) {
    return await this.get(`blacklist:${token}:${username}`);
  }
}
