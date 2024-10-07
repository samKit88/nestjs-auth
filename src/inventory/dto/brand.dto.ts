import { IsString } from 'class-validator';

export class BrandDto {
  @IsString()
  name: string;
}
