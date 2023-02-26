import {
  IsString,
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  //INFO: decorators to validates fields
  @IsString()
  @MinLength(1)
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  sizes?: string[];

  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender?: string;

  @IsString({ each: true })
  @IsArray()
  tags?: string[];
}
