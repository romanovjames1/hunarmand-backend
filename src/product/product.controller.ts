import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
  Put,
  UseGuards,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { PaginationDto } from '../dtos/pagination.query.dto';
import { Languages } from '../enums/language.enum';
import { JwtGuard } from '../guards/jwt.guard';
import { ParseJsonPipe } from 'src/pipes/json-validation.pipe';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'add product', description: 'adding product' })
  @ApiResponse({ status: 201, description: 'Successfully added' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 400, description: 'Invalid data enetered' })
  @ApiResponse({ status: 404, description: 'Not found error' })
  @ApiResponse({ status: 409, description: 'Conflict error' })
  @ApiResponse({ status: 423, description: 'Too many requests' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'images', maxCount: 3 },
    ]),
  )
  @ApiBody({ type: CreateProductDto })
  @Post()
  create(
    @Body('translations', ParseJsonPipe) translations: any,
    @Body() body: Record<string, any>,
    @UploadedFiles()
    files: { thumbnail: Express.Multer.File; images: Express.Multer.File[] },
  ) {
    let translationsArray: any[];
    if (typeof body.translations === 'string') {
      try {
        translationsArray = JSON.parse(body.translations);
      } catch (e) {
        throw new BadRequestException(
          'Translations field must be a valid JSON array string.',
        );
      }
    } else {
      translationsArray = body.translations || [];
    }

    const cleanedTranslations = translationsArray.map((item) => {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        return item;
      }

      if (typeof item === 'string') {
        try {
          return JSON.parse(item);
        } catch (e) {
          throw new BadRequestException(
            'An element within the translations array is invalid JSON.',
          );
        }
      }

      return item;
    });

    const createProductDto: CreateProductDto = {
      ...body,
      translations: cleanedTranslations,
    } as CreateProductDto;
    return this.productService.create(createProductDto, files);
  }

  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    default: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    default: 1,
  })
  @ApiQuery({
    name: 'q',
    type: 'string',
    required: false,
    description: 'title search',
  })
  @ApiQuery({
    name: 'language',
    enum: Languages,
    required: false,
    description: 'Language based search',
  })
  @ApiQuery({
    name: 'categoryId',
    type: 'string',
    description: 'category based search',
    required: false,
  })
  @ApiOperation({ summary: 'get products', description: 'get products' })
  @ApiResponse({ status: 200, description: 'Successfully returned' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 400, description: 'Invalid data enetered' })
  @ApiResponse({ status: 404, description: 'Not found error' })
  @ApiResponse({ status: 409, description: 'Conflict error' })
  @ApiResponse({ status: 423, description: 'Too many requests' })
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.productService.findAll(query);
  }

  @ApiOperation({
    summary: 'get product by id',
    description: 'get product by id',
  })
  @ApiResponse({ status: 200, description: 'Successfully returned' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 400, description: 'Invalid data enetered' })
  @ApiResponse({ status: 404, description: 'Not found error' })
  @ApiResponse({ status: 409, description: 'Conflict error' })
  @ApiResponse({ status: 423, description: 'Too many requests' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Partially update product details, translations, and/or files',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'images', maxCount: 3 },
    ]),
  )
  @ApiBody({ type: UpdateProductDto })
  async update(
    @Param('id') id: string,
    @Body('translations', ParseJsonPipe)
    translations: any,
    @Body() body: Record<string, any>,
    @UploadedFiles()
    files?: { thumbnail?: Express.Multer.File; images?: Express.Multer.File[] },
  ) {
    const updateProductDto: UpdateProductDto = {
      ...body,
      translations: translations || undefined,
    } as UpdateProductDto;

    return this.productService.update(id, updateProductDto, {
      thumbnail: files?.thumbnail ? files.thumbnail : undefined,
      images:
        files?.images && files.images.length > 0 ? files.images : undefined,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'delete product by id',
    description: 'delete product by id',
  })
  @ApiResponse({ status: 200, description: 'Successfully deleted' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 400, description: 'Invalid data enetered' })
  @ApiResponse({ status: 404, description: 'Not found error' })
  @ApiResponse({ status: 409, description: 'Conflict error' })
  @ApiResponse({ status: 423, description: 'Too many requests' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
