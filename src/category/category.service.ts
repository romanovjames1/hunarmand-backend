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
import { QueryDto } from '../dtos/query.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}
  // [POST] add categories
  async create(createCategoryDto: CreateCategoryDto) {
    await this.categoryModel.create(createCategoryDto);

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

    categories = categorisDb;
    categoriesCount = categoriesCountDb;

    if (categorisDb.length === 0)
      throw new NotFoundException('No products found');

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
    const categoryDb = await this.categoryModel.findById(id);
    if (!categoryDb) throw new NotFoundException('No category found');

    return categoryDb;
  }

  // [UPDATE] update categories
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    const updatedCategoy = await this.categoryModel.findOneAndUpdate(
      { _id: id },
      updateCategoryDto,
    );

    return updatedCategoy;
  }

  // [DELETE] delete category by id
  async remove(id: string) {
    await this.findOne(id);

    await this.categoryModel.findOneAndDelete({ _id: id });

    return `Successfully deleted`;
  }
}
