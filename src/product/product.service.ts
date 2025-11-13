import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RedisService } from 'src/redis/redis.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/schemas/category.schema';
import { Model } from 'mongoose';
import { Product } from 'src/schemas/products.schema';
import { PaginationDto } from 'src/dtos/pagination.query.dto';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import prismaConfig from 'prisma.config';
import { ProductModule } from './product.module';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private catModel: Model<Category>,

    private redis: RedisService,
    private cloudinaryService: CloudinaryService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    files: { thumbnail: Express.Multer.File; images: Express.Multer.File[] },
  ) {
    if (files.images.length > 3)
      throw new BadRequestException('Images can only be upload 3 per product');
    createProductDto.price = Number(createProductDto.price);
    createProductDto.stockQuantity = Number(createProductDto.stockQuantity);

    const categoryExists = await this.catModel.findById(
      createProductDto.categoryId,
    );
    if (!categoryExists)
      throw new NotFoundException('Category not found at this id');
    const thumbnailUrl = await this.cloudinaryService
      .uploadImage(files.thumbnail[0])
      .then((data) => {
        return data.secure_url;
      })
      .catch((err) => {
        throw new BadRequestException('Error while uploading image');
      });
    const imageUrls: string[] = [];
    for (const image of files.images) {
      const imageUrl = await this.cloudinaryService
        .uploadImage(image)
        .then((data) => {
          return data.secure_url;
        })
        .catch((err) => {
          throw new BadRequestException('Error while uploading image');
        });

      imageUrls.push(imageUrl);
    }

    const createdProduct = await this.productModel.create({
      ...createProductDto,
      images: imageUrls,
      thumbnail: thumbnailUrl,
      category: categoryExists,
    });

    await this.redis.delWithPrefix('products');
    return createdProduct;
  }

  // [GET] get all producs
  async findAll(query: PaginationDto) {
    const q = query.q;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const language = query.language;
    const categoryId = query.categoryId;

    if (limit < 1 || page < 1)
      throw new BadRequestException(
        `${limit < 1 ? 'Limit' : 'Page'} is invalid.`,
      );
    const offset = (page - 1) * limit;

    let categoryExists: any;
    if (categoryId) {
      const categoryDb = await this.catModel.findById(categoryId);
      if (!categoryDb)
        throw new NotFoundException('Category not found at this id');
      categoryExists = categoryDb;
    }
    let products: any[];
    let productsCount: number;
    const cacheProducts = await this.redis.get(
      `products:page:${page}:${limit}:${language}:${q}:${categoryId}`,
    );
    const cacheProductsCount = await this.redis.get(
      `products:count:${language}:${page}:${language}:${q}:${categoryId}`,
    );

    let whereOptions = {};
    if (q) {
      whereOptions['title'] = q;
    }

    if (language) whereOptions['language'] = language;
    if (categoryId) whereOptions['category'] = categoryExists;

    const [productsCountDb, productsDb] = await Promise.all([
      this.productModel
        .countDocuments({
          ...whereOptions,
        })
        .exec(),

      this.productModel
        .find({
          ...whereOptions,
        })
        .skip(offset)
        .limit(limit)
        .exec(),
    ]);

    if (cacheProducts && cacheProductsCount) {
      products = JSON.parse(cacheProducts);
      productsCount = +cacheProductsCount;
    } else {
      products = productsDb;
      productsCount = productsCountDb;
    }

    if (productsDb.length === 0)
      throw new NotFoundException('No products found');

    if (productsDb.length > 0 && productsCountDb >= 1) {
      await this.redis.set(
        `products:page:${page}:${limit}:${language}:${q}:${categoryId}`,
        productsDb,
        60,
      );

      await this.redis.set(
        `products:count:${language}:${page}:${language}:${q}:${categoryId}`,
        productsCountDb,
        60,
      );
    }

    const totalPages = Math.ceil(productsCount / limit);
    return {
      currentPage: +page,
      totalPages,
      hasNextPage: page < totalPages,
      totalDataCount: productsCount,
      data: products,
    };
  }

  // [GET] product by id
  async findOne(id: string) {
    const productCache = await this.redis.get(`products:${id}`);
    if (productCache) return JSON.parse(productCache);

    const productDb = await this.productModel.findById(id);
    if (!productDb) throw new NotFoundException('No product found at this id');

    await this.redis.set(`products:${id}`, productDb, 60);

    return productDb;
  }

  // [PUT] put update product by id
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files?: { thumbnail: Express.Multer.File; images: Express.Multer.File[] },
  ) {
    await this.findOne(id);

    updateProductDto.price = updateProductDto.price
      ? Number(updateProductDto.price)
      : undefined;
    updateProductDto.stockQuantity = updateProductDto.stockQuantity
      ? Number(updateProductDto.stockQuantity)
      : undefined;

    let category: Category | undefined;
    if (updateProductDto.categoryId) {
      const categoryExists = await this.catModel.findById(
        updateProductDto.categoryId,
      );
      if (!categoryExists)
        throw new NotFoundException('Category not found at this id');
      category = categoryExists;
    }
    const imageUrls: string[] = [];
    if (files?.images) {
      for (const image of files.images) {
        const imageUrl = await this.cloudinaryService
          .uploadImage(image)
          .then((data) => {
            return data.secure_url;
          })
          .catch((err) => {
            throw new BadRequestException('Error while uploading image');
          });

        imageUrls.push(imageUrl);
      }
    }
    let thumbnailUrl: string | undefined;
    if (files?.thumbnail) {
      thumbnailUrl = await this.cloudinaryService
        .uploadImage(files.thumbnail[0])
        .then((data) => {
          return data.secure_url;
        })
        .catch((err: any) => {
          throw new BadRequestException('Error while uploading image');
        });
    }

    const updatedProduct = await this.productModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        ...updateProductDto,
        images: files?.images ? imageUrls : undefined,
        thumbnail: thumbnailUrl,
        category: category,
      },
    );

    await this.redis.delWithPrefix('products');
    return updatedProduct;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.productModel.findOneAndDelete({ _id: id });

    await this.redis.delWithPrefix('products');

    return `Successfully deleted`;
  }
}
