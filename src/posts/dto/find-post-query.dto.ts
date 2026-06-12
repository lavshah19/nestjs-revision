import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination-query.dto';

export class FindPostQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(100, { message: 'Title must be at most 100 characters long' })
  title: string;
}
