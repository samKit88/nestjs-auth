import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsString()
  page: string;

  @IsOptional()
  @IsString()
  limit: string;

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsString()
  order: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  search: string;
}
