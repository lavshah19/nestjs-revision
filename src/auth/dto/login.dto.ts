import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(50, { message: 'Password must be at most 50 characters long' })
  password: string;
}
