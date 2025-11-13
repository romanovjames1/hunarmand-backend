import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class GuardMiddleware implements NestMiddleware {
  constructor(
    private redis: RedisService,
    private jwt: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const accessTokenDecoded = await this.jwt.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      const getBlacklistedToken = await this.redis.getFromBlackList(
        token,
        accessTokenDecoded.username,
      );

      if (getBlacklistedToken)
        throw new UnauthorizedException('Token is invalid');
    }
    next();
  }
}
