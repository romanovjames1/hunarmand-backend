import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { UpdateAdminAuthDto } from './dto/update-admin-auth.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAdminAuthDto } from './dto/create-admin-auth.dto';
import { AdminLoginDto } from './dto/login-auth.dto';
import express, { Request } from 'express';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @ApiOperation({
    summary: 'admin create',
    description: 'admin create',
  })
  @ApiResponse({ status: 200, description: 'Successfully created' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 400, description: 'Invalid data enetered' })
  @ApiResponse({ status: 404, description: 'Not found error' })
  @ApiResponse({ status: 409, description: 'Conflict error' })
  @ApiResponse({ status: 423, description: 'Too many requests' })
  @Post()
  create(@Body() createAdminAuthDto: CreateAdminAuthDto) {
    return this.adminAuthService.create(createAdminAuthDto);
  }

  @ApiOperation({
    summary: 'admins login',
    description: 'admins login. this way admins can login',
  })
  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 400, description: 'Invalid data enetered' })
  @ApiResponse({ status: 404, description: 'Not found error' })
  @ApiResponse({ status: 409, description: 'Conflict error' })
  @ApiResponse({ status: 423, description: 'Too many requests' })
  @Post('login')
  login(@Body() loginAuthDto: AdminLoginDto) {
    return this.adminAuthService.login(loginAuthDto);
  }

  @ApiOperation({
    summary: 'admins get me',
    description: 'admins get me function',
  })
  @ApiResponse({ status: 200, description: 'Successfully returned' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 400, description: 'Invalid data enetered' })
  @ApiResponse({ status: 404, description: 'Not found error' })
  @ApiResponse({ status: 409, description: 'Conflict error' })
  @ApiResponse({ status: 423, description: 'Too many requests' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('give/me')
  findMe(@Req() req: express.Request) {
    return this.adminAuthService.findMe(req);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'update me admin',
    description: 'update me function',
  })
  @ApiResponse({ status: 200, description: 'Successfully updated' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 400, description: 'Invalid data enetered' })
  @ApiResponse({ status: 404, description: 'Not found error' })
  @ApiResponse({ status: 409, description: 'Conflict error' })
  @ApiResponse({ status: 423, description: 'Too many requests' })
  @Put(':id')
  update(
    @Req() req: express.Request,
    @Body() updateAdminAuthDto: UpdateAdminAuthDto,
  ) {
    return this.adminAuthService.update(req, updateAdminAuthDto);
  }
}
