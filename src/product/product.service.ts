import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// import { RedisService } from '../redis/redis.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../schemas/category.schema';
import { Model, Types } from 'mongoose';
import { Product } from '../schemas/products.schema';
import { PaginationDto } from '../dtos/pagination.query.dto';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import prismaConfig from 'prisma.config';
import { ProductModule } from './product.module';
import { PartialProductTranslationDto } from './dto/partial.update.product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private catModel: Model<Category>,

    private cloudinaryService: CloudinaryService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    files: { thumbnail: Express.Multer.File; images: Express.Multer.File[] },
  ) {
    const MAX_IMAGES = 3;

    if (files.images.length > MAX_IMAGES) {
      throw new BadRequestException(
        `Only ${MAX_IMAGES} extra images can be uploaded per product.`,
      );
    }

    const categoryExists = await this.catModel
      .findById(createProductDto.categoryId)
      .exec();
    if (!categoryExists) {
      throw new NotFoundException('Category not found at this ID.');
    }

    try {
      const thumbnailFile = files.thumbnail[0];
      const imagesFiles = files.images;

      const thumbnailPromise =
        this.cloudinaryService.uploadImage(thumbnailFile);
      const imagesPromises = imagesFiles.map((image) =>
        this.cloudinaryService.uploadImage(image),
      );

      const [thumbnailResult, ...imageResults] = await Promise.all([
        thumbnailPromise,
        ...imagesPromises,
      ]);

      const thumbnailUrl = thumbnailResult.secure_url;
      const imageUrls = imageResults.map((result) => result.secure_url);

      const createdProduct = await this.productModel.create({
        price: createProductDto.price,
        color: createProductDto.color,
        size: createProductDto.size,
        stockQuantity: createProductDto.stockQuantity,
        translations: createProductDto.translations,
        category: new Types.ObjectId(createProductDto.categoryId),
        thumbnail: thumbnailUrl,
        images: imageUrls,
      });

      return createdProduct;
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        throw new BadRequestException('Product with this SKU already exists.');
      }
      throw new InternalServerErrorException(
        'Failed to create product due to an upload or database error.',
      );
    }
  }
  // [GET] get all producs
  async findAll(query: PaginationDto) {
    const { q, page, limit, language, categoryId } = query;

    const currentPage = page ? +page : 1;
    const pageSize = limit ? +limit : 10;

    if (pageSize < 1 || currentPage < 1) {
      throw new BadRequestException(
        `${pageSize < 1 ? 'Limit' : 'Page'} is invalid.`,
      );
    }
    const offset = (currentPage - 1) * pageSize;

    const whereOptions: any = {};
    const translationMatch: any = {};

    if (categoryId) {
      if (!Types.ObjectId.isValid(categoryId)) {
        throw new BadRequestException('Invalid Category ID format.');
      }
      whereOptions['category'] = new Types.ObjectId(categoryId);
    }

    if (language) {
      translationMatch['language'] = language;
    }

    if (q) {
      translationMatch['title'] = { $regex: q, $options: 'i' };
    }

    if (Object.keys(translationMatch).length > 0) {
      whereOptions['translations'] = { $elemMatch: translationMatch };
    }

    // --- 3. Execute Queries Concurrently ---
    const [productsCount, productsDb] = await Promise.all([
      this.productModel.countDocuments(whereOptions).exec(),

      this.productModel
        .find(whereOptions)
        .skip(offset)
        .limit(pageSize)

        .exec(),
    ]);

    if (productsDb.length === 0 && productsCount === 0) {
      throw new NotFoundException('No products found matching the criteria.');
    }

    const totalPages = Math.ceil(productsCount / pageSize);

    return {
      currentPage: currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      totalDataCount: productsCount,
      data: productsDb,
    };
  }

  // [GET] product by id
  async findOne(id: string) {
    const productDb = await this.productModel.findById(id);
    if (!productDb) throw new NotFoundException('No product found at this id');
    return productDb;
  }

  // [PUT] put update product by id
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files?: {
      thumbnail?: Express.Multer.File;
      images?: Express.Multer.File[];
    },
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format.');
    }

    const { translations, categoryId, ...simpleUpdateData } = updateProductDto;

    const updatePayload: any = { $set: {} };
    const cleanedSimpleUpdateData = {};

    // Iterate over the simple fields and only keep non-empty, non-null, non-undefined values
    for (const key in simpleUpdateData) {
      const value = simpleUpdateData[key];

      // Check if the value is not null, not undefined, and not an empty string
      if (value !== null && value !== undefined && value !== '') {
        cleanedSimpleUpdateData[key] = value;
      }
    }
    if (Object.keys(cleanedSimpleUpdateData).length > 0) {
      Object.assign(updatePayload.$set, cleanedSimpleUpdateData);
    }

    if (categoryId) {
      const categoryExists = await this.catModel.findById(categoryId).exec();
      if (!categoryExists) {
        throw new NotFoundException('Category not found at this ID.');
      }
      updatePayload.$set.category = new Types.ObjectId(categoryId);
    }

    try {
      const uploadPromises: Promise<any>[] = [];

      const isThumbnailUpdate = files?.thumbnail ? files.thumbnail : false;
      const isImagesUpdate = (files?.images?.length ?? 0) > 0;

      console.log(files, isThumbnailUpdate);
      const safeUpload = async (
        file: Express.Multer.File,
      ): Promise<{ secure_url: string }> => {
        const result = await this.cloudinaryService.uploadImage(file);

        if ('secure_url' in result) {
          return result as { secure_url: string };
        }
        throw new InternalServerErrorException(
          'Cloudinary upload failed for a file.',
        );
      };

      if (isThumbnailUpdate) {
        uploadPromises.push(safeUpload(files!.thumbnail![0]));
      }
      if (isImagesUpdate) {
        files!.images!.forEach((image) => {
          uploadPromises.push(safeUpload(image));
        });
      }

      const results = await Promise.all(uploadPromises);

      let resultIndex = 0;

      console.log(isThumbnailUpdate, isImagesUpdate, 'cheking');
      if (isThumbnailUpdate) {
        updatePayload.$set.thumbnail = results[resultIndex++].secure_url;
      } else {
        delete updatePayload.$set.thumbnail;
      }

      if (isImagesUpdate) {
        const imageUrls = results
          .slice(resultIndex)
          .map((res) => res.secure_url);
        updatePayload.$set.images = imageUrls;
      } else {
        delete updatePayload.$set.images;
      }
    } catch (e) {
      console.log(e);
      if (e instanceof InternalServerErrorException) {
        throw e;
      }
      throw new BadRequestException(
        'A general error occurred while processing file uploads.',
      );
    }
    let translationUpdateProperties = {};
    let arrayFiltersToApply: any[] = [];
    let hasTranslationUpdates = false;

    console.log(translations, '======================');
    if (translations && translations.length > 0) {
      translations.forEach((t: PartialProductTranslationDto, index) => {
        const fieldsToUpdate = Object.keys(t).filter(
          (key) =>
            key !== 'language' &&
            t[key] !== undefined &&
            (typeof t[key] !== 'string' || t[key].trim() !== ''),
        );

        if (fieldsToUpdate.length > 0) {
          const filterName = `t${index}`;

          if (!t.language) {
            throw new BadRequestException(
              `Translation object at index ${index} is missing the required 'language' key for identification.`,
            );
          }

          arrayFiltersToApply.push({ [`${filterName}.language`]: t.language });

          if (t.title !== undefined && t.title.trim() !== '') {
            translationUpdateProperties[`translations.$[${filterName}].title`] =
              t.title;
            hasTranslationUpdates = true;
          }

          if (t.description !== undefined && t.description.trim() !== '') {
            translationUpdateProperties[
              `translations.$[${filterName}].description`
            ] = t.description;
            hasTranslationUpdates = true;
          }
        }
      });
    }

    if (hasTranslationUpdates) {
      Object.assign(updatePayload.$set, translationUpdateProperties);

      updatePayload.arrayFilters = arrayFiltersToApply;
    } else {
      delete updatePayload.arrayFilters;
    }

    if (Object.keys(updatePayload.$set).length === 0) {
      delete updatePayload.$set;
    }

    if (Object.keys(updatePayload).length === 0) {
      throw new BadRequestException(
        'Yangilash uchun yaroqli maydonlar topilmadi.',
      );
    }
    console.log(updatePayload);
    const isOnlyTranslationUpdate =
      Object.keys(updatePayload).length === 2 &&
      updatePayload.$set &&
      updatePayload.arrayFilters;

    if (isOnlyTranslationUpdate) {
      console.log('Final $set Content:', updatePayload.$set);
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updatePayload.$set, {
          new: true,
          arrayFilters: updatePayload.arrayFilters,
          runValidators: true,
        })
        .exec();
      return updatedProduct;
    } else {
      console.log('Final $set Content:', updatePayload.$set);
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updatePayload, {
          new: true,
          runValidators: true,
        })
        .exec();
      return updatedProduct;
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.productModel.findOneAndDelete({ _id: id });

    return `Successfully deleted`;
  }
}
