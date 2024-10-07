import { IsString } from 'class-validator';
import { Product, Tax, Unit } from '@prisma/client';

export class InveDto {
  @IsString()
  name: string;

  userID: number;

  @IsString()
  barcode: string;

  category: number;

  brand: number;

  buyingPrice: number;

  sellingPrice: number;

  productUnit: Unit;

  quantity: number;

  taxType: Tax;

  description: string;

  produtType: Product;
}
