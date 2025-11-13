import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { RedisModule } from 'src/redis/redis.module';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CatSchema } from '../schemas/category.schema';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([{ name: Category.name, schema: CatSchema }]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
