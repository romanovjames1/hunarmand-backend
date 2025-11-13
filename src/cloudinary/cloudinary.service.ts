import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream from 'buffer-to-stream';
import { Readable } from 'stream';
const { BufferStream, streamToBuffer } = require('@myrotvorets/buffer-stream');

// UPLOAD to the CLOUDINARY
@Injectable()
export class CloudinaryService {
  async uploadImage(
    image: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result: any) => {
        if (error) return reject(error);
        resolve(result);
      });

      console.log(image);

      toStream(image.buffer).pipe(upload);
    });
  }
}
