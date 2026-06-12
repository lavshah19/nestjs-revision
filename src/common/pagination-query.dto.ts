import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'page must be greater than or equal to 1' })
  page: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'limit must be greater than or equal to 1' })
  limit: number = 10;
}
