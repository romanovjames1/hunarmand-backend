import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'string') {
      return value;
    }

    // Clean up whitespace
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return null;
    }

    let jsonString = trimmedValue;

    if (jsonString.startsWith('{') && !jsonString.startsWith('[')) {
      if (jsonString.includes('},{')) {
        jsonString = `[${jsonString}]`;
      } else if (!jsonString.endsWith('}')) {
        jsonString = `[${jsonString}]`;
      }
    }

    try {
      if (!jsonString.startsWith('[') && jsonString.includes('},{')) {
        jsonString = `[${jsonString}]`;
      }

      const parsedValue = JSON.parse(jsonString);

      if (!Array.isArray(parsedValue) && jsonString.startsWith('{')) {
        return [parsedValue];
      }

      return parsedValue;
    } catch (e) {
      console.error('JSON Parse Error during transformation:', e);
      throw new BadRequestException(
        'Validation failed (invalid JSON format in multipart field)',
      );
    }
  }
}
