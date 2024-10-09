import { IsDecimal, IsEnum, IsNumber, IsString } from 'class-validator';
import { Product, Tax, Unit } from '@prisma/client';

export class InveDto {
  @IsString()
  name: string;
  @IsString()
  barcode: string;
  @IsNumber()
  categoryId: number;
  @IsNumber()
  brandId: number;
  @IsDecimal()
  buyingPrice: number;
  @IsDecimal()
  sellingPrice: number;
  @IsEnum(Unit)
  productUnit: Unit;
  @IsNumber()
  quantity: number;
  @IsEnum(Tax)
  taxType: Tax;
  @IsString()
  description: string;
  @IsEnum(Product)
  produtType: Product;
}
