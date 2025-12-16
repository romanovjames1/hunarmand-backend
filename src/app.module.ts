import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global.exception.filter';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './category/category.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
} from 'nestjs-i18n';
import * as path from 'path';

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

    CategoryModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
