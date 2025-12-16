// src/product/dto/product.types.ts (Redefine or confirm this file)

import { CreateProductDto } from './create-product.dto';
import { PartialProductTranslationDto } from './partial.update.product.dto';

type ProductWithoutTranslations = Omit<CreateProductDto, 'translations'>;

export type UpdateProductType = Partial<ProductWithoutTranslations> & {
  translations?: PartialProductTranslationDto[];
};
