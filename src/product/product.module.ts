import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'src/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig, multerOptions } from 'src/multer/multer.options';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CatSchema } from '../schemas/category.schema';
import { Product, ProductSchema } from '../schemas/products.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CatSchema },
    ]),
    CloudinaryModule,
    RedisModule,
    MulterModule.register({ ...multerConfig, ...multerOptions }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
