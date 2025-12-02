import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminAuthDto } from './dto/create-admin-auth.dto';
import { UpdateAdminAuthDto } from './dto/update-admin-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from '../schemas/admin.schema';
import { Model } from 'mongoose';
// import { RedisService } from '../redis/redis.service';
import { AdminLoginDto } from './dto/login-auth.dto';
import { addAbortListener } from 'events';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    // private redis: RedisService,
    private jwt: JwtService,
  ) {}
  // [POST] add admin only one
  async create(createAdminAuthDto: CreateAdminAuthDto) {
    const adminExists = await this.adminModel.find();
    if (adminExists.length > 0)
      throw new BadRequestException(
        "Admin can only be one can't be created any",
      );
    const hashedPassword = await bcrypt.hash(
      createAdminAuthDto.password,
      Number(process.env.HASH_SALT),
    );
    await this.adminModel.create({
      ...createAdminAuthDto,
      password: hashedPassword,
    });
    return 'Successfully created';
  }

  // [POST] login admin
  async login(loginAdmindto: AdminLoginDto) {
    // let admin: any;
    // const adminExistsCache = await this.redis.get(
    //   `admins:${loginAdmindto.username}`,
    // );
    // if (adminExistsCache) admin = JSON.parse(adminExistsCache);

    const adminExists = await this.adminModel.findOne({
      username: loginAdmindto.username,
    });
    if (!adminExists)
      throw new BadRequestException('Username or password is invalid');

    const comparePassword = await bcrypt.compare(
      loginAdmindto.password,
      adminExists.password,
    );
    if (!comparePassword)
      throw new BadRequestException('Password or password is invalid');

    // await this.redis.set(`admins:${loginAdmindto.username}`, adminExists);
    // admin = adminExists;

    const payload = {
      id: adminExists._id,
      username: adminExists.username,
    };

    // const adminToken = await this.redis.get(
    //   `admin:token:${loginAdmindto.username}`,
    // );

    // if (adminToken) {
    //   await this.redis.addTokenToTheBlackList(
    //     JSON.parse(adminToken),
    //     loginAdmindto.username,
    //   );
    // }

    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_EXP as any,
    });

    // await this.redis.set(`admin:token:${loginAdmindto.username}`, accessToken);
    return { accessToken };
  }

  // [GET] get admin by id
  async findOne(id: string) {
    // const adminsCache = await this.redis.get(`admins:${id}`);
    // if (adminsCache) return JSON.parse(adminsCache);

    const admin = await this.adminModel.findOne({ _id: id });
    if (!admin) throw new NotFoundException('No admins found at this id');
    const adminHiddenPassword = JSON.parse(JSON.stringify(admin));
    delete adminHiddenPassword.password;

    // await this.redis.set(`admins:${id}`, adminHiddenPassword, 60);
    return adminHiddenPassword;
  }

  // [GET] get admin by id
  async findMe(req: Request) {
    if (req.user) {
      // const adminsCache = await this.redis.get(`admins:me:${req.user.id}`);
      // if (adminsCache) return JSON.parse(adminsCache);

      const admin = await this.adminModel.findOne({
        _id: req.user.id,
        username: req.user.username,
      });
      if (!admin)
        throw new NotFoundException(
          'Admin not registered yet. Please register',
        );
      const adminHiddenPassword = JSON.parse(JSON.stringify(admin));
      delete adminHiddenPassword.password;
      // await this.redis.set(`admins:me:${req.user.id}`, adminHiddenPassword, 60);

      return adminHiddenPassword;
    } else {
      throw new NotFoundException('Admin not registered yet. Please register');
    }
  }

  // [PUT] update admin by id
  async update(req: Request, updateAdminAuthDto: UpdateAdminAuthDto) {
    if (req.user) {
      await this.findOne(req.user.id);
      if (updateAdminAuthDto.password) {
        const hashedPassword = await bcrypt.hash(
          updateAdminAuthDto.password,
          Number(process.env.HASH_SALT),
        );
        updateAdminAuthDto.password = hashedPassword;
      }
      await this.adminModel.findOneAndUpdate(
        { _id: req.user.id },
        { ...updateAdminAuthDto },
      );

      // await this.redis.delWithPrefix('admins');
      return `Successfully updated`;
    } else {
      throw new NotFoundException('Admin not registered yet. Please register');
    }
  }
}
