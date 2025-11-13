import { HttpException, HttpStatus } from '@nestjs/common';
import { memoryStorage } from 'multer';
import * as path from 'path';

export const multerOptions = {
  limits: {
    fileSize: eval(process.env.MAX_IMAGE_SIZE as string),
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) cb(null, true);
    else
      cb(
        new HttpException(
          'Unsupported filetype: ' + path.extname(file.originalname),
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
  },
  storage: memoryStorage(),
};

export const multerConfig = {
  dest: process.env.MULTER_DESTINATION,
};
