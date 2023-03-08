import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

//INFO: Pagination DTO
export class PaginationDTo {
  @ApiProperty()
  @IsOptional()
  @IsPositive()
  //INFO: transform property type tu number
  @Type(() => Number)
  limit?: number;

  @ApiProperty()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
