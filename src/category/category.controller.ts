import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Languages } from 'src/enums/language.enum';
import { QueryDto } from 'src/dtos/query.dto';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'add category', description: 'adding category' })
  @ApiResponse({ status: 201, description: 'Successfully added' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 400, description: 'Invalid data enetered' })
  @ApiResponse({ status: 404, description: 'Not found error' })
  @ApiResponse({ status: 409, description: 'Conflict error' })
  @ApiResponse({ status: 423, description: 'Too many requests' })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
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
  @ApiOperation({ summary: 'get categories', description: 'get categories' })
  @ApiResponse({ status: 200, description: 'Successfully returned' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 400, description: 'Invalid data enetered' })
  @ApiResponse({ status: 404, description: 'Not found error' })
  @ApiResponse({ status: 409, description: 'Conflict error' })
  @ApiResponse({ status: 423, description: 'Too many requests' })
  @Get()
  findAll(@Query() query: QueryDto) {
    return this.categoryService.findAll(query);
  }

  @ApiOperation({ summary: 'get category', description: 'get category' })
  @ApiResponse({ status: 200, description: 'Successfully returned' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 400, description: 'Invalid data enetered' })
  @ApiResponse({ status: 404, description: 'Not found error' })
  @ApiResponse({ status: 409, description: 'Conflict error' })
  @ApiResponse({ status: 423, description: 'Too many requests' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'update category', description: 'update category' })
  @ApiResponse({ status: 200, description: 'Successfully updated' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 400, description: 'Invalid data enetered' })
  @ApiResponse({ status: 404, description: 'Not found error' })
  @ApiResponse({ status: 409, description: 'Conflict error' })
  @ApiResponse({ status: 423, description: 'Too many requests' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'delete category', description: 'update category' })
  @ApiResponse({ status: 200, description: 'Successfully updated' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 400, description: 'Invalid data enetered' })
  @ApiResponse({ status: 404, description: 'Not found error' })
  @ApiResponse({ status: 409, description: 'Conflict error' })
  @ApiResponse({ status: 423, description: 'Too many requests' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
