import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { GlobalExceptionFilter } from './filters/global.exception.filter';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URL as string),
    JwtModule.register({
      secret: process.env.TOKEN_KEY,
      signOptions: {
        expiresIn: process.env.TOKEN_EXP as any,
      },
      global: true,
    }),
    AdminAuthModule,
    ProductModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: process.env.REDIS_HOST, // Redis server host
          port: Number(process.env.REDIS_PORT), // Redis server port
          password: process.env.REDIS_PASSWORD || undefined,
        }),
      ),
    }),
    CategoryModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
