import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { RedisModule } from 'src/redis/redis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    RedisModule,
    PassportModule,
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    JwtModule.register({
      secret: process.env.TOKEN_KEY,
      signOptions: {
        expiresIn: process.env.TOKEN_EXP as any,
      },
      global: true,
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, JwtStrategy],
})
export class AdminAuthModule {}
