import {
  IsDecimal,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Product, Tax, Unit } from '@prisma/client';

export class UpdateDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  barcode: string;
  @IsOptional()
  @IsNumber()
  categoryId: number;
  @IsOptional()
  @IsNumber()
  brandId: number;
  @IsOptional()
  @IsDecimal()
  buyingPrice: number;
  @IsOptional()
  @IsDecimal()
  sellingPrice: number;
  @IsOptional()
  @IsEnum(Unit)
  productUnit: Unit;
  @IsOptional()
  @IsNumber()
  quantity: number;
  @IsOptional()
  @IsEnum(Tax)
  taxType: Tax;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsEnum(Product)
  produtType: Product;
}
