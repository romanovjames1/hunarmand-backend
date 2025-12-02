import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../schemas/category.schema';
import { Model } from 'mongoose';
// import { RedisService } from '../redis/redis.service';
import { QueryDto } from '../dtos/query.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    // private redis: RedisService,
  ) {}
  // [POST] add categories
  async create(createCategoryDto: CreateCategoryDto) {
    await this.categoryModel.create(createCategoryDto);

    // await this.redis.delWithPrefix('products');
    // await this.redis.delWithPrefix('categories');
    return 'Successfully created';
  }

  // [GET] get all categories
  async findAll(query: QueryDto) {
    const q = query.q;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const language = query.language;

    if (limit < 1 || page < 1)
      throw new BadRequestException(
        `${limit < 1 ? 'Limit' : 'Page'} is invalid.`,
      );

    const offset = (page - 1) * limit;

    let categories: any[];
    let categoriesCount: number;
    // const cacheCategories = await this.redis.get(
    //   `categories:page:${page}:${limit}:${language}:${q}`,
    // );
    // const cacheCategoriesCount = await this.redis.get(
    //   `categories:count:${language}:${page}:${language}:${q}`,
    // );

    let whereOptions = {};
    if (q) whereOptions['title'] = q;
    if (language) whereOptions['language'] = language;

    const [categoriesCountDb, categorisDb] = await Promise.all([
      this.categoryModel
        .countDocuments({
          ...whereOptions,
        })
        .exec(),
      this.categoryModel
        .find({
          ...whereOptions,
        })
        .skip(offset)
        .limit(limit)
        .exec(),
    ]);

    // if (cacheCategories && cacheCategoriesCount) {
    //   categories = JSON.parse(cacheCategories);
    //   categoriesCount = +cacheCategoriesCount;
    // } else {
    categories = categorisDb;
    categoriesCount = categoriesCountDb;
    // }

    if (categorisDb.length === 0)
      throw new NotFoundException('No products found');

    // if (categorisDb.length > 0 && categoriesCountDb >= 1) {
    //   await this.redis.set(
    //     `categories:page:${page}:${limit}:${language}:${q}`,
    //     categorisDb,
    //     60,
    //   );

    //   await this.redis.set(
    //     `categories:count:${language}:${page}:${language}:${q}`,
    //     categoriesCountDb,
    //     60,
    //   );
    // }

    const totalPages = Math.ceil(categoriesCount / limit);
    return {
      currentPage: +page,
      totalPages,
      hasNextPage: page < totalPages,
      totalDataCount: categoriesCount,
      data: categories,
    };
  }

  // [GET] get categories by id
  async findOne(id: string) {
    // const categoryCache = await this.redis.get(`categories:${id}`);
    // if (categoryCache) return JSON.parse(categoryCache);

    const categoryDb = await this.categoryModel.findById(id);
    if (!categoryDb) throw new NotFoundException('No category found');

    // await this.redis.set(`categories:${id}`, categoryDb, 60);

    return categoryDb;
  }

  // [UPDATE] update categories
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    const updatedCategoy = await this.categoryModel.findOneAndUpdate(
      { _id: id },
      updateCategoryDto,
    );

    // await this.redis.delWithPrefix('categories');
    // await this.redis.delWithPrefix('products');
    return updatedCategoy;
  }

  // [DELETE] delete category by id
  async remove(id: string) {
    await this.findOne(id);

    await this.categoryModel.findOneAndDelete({ _id: id });
    // await this.redis.delWithPrefix('categories');
    // await this.redis.delWithPrefix('products');
    return `Successfully deleted`;
  }
}
