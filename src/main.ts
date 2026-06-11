import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Global Validation Pipe
   *
   * Runs for every incoming request before it reaches controllers.
   * Used for DTO validation and automatic data transformation.
   *
   * whitelist: true
   * - Removes properties that are not defined in the DTO.
   * - Prevents users from sending unexpected fields.
   *
   * forbidNonWhitelisted: true
   * - Throws a 400 Bad Request error if extra fields are sent.
   * - Useful for strict API validation and security.
   *
   * transform: true
   * - Converts incoming values to the types defined in the DTO.
   * - Example: "123" -> 123 when a property is typed as number.
   * - Also converts plain request objects into DTO instances.
   *
   * disableErrorMessages: false
   * - Returns detailed validation errors.
   * - Set to true in production if you want to hide validation details.
   *
   * Example:
   * Request Body:
   * {
   *   "name": "Lav",
   *   "age": "20",
   *   "role": "admin"
   * }
   *
   * DTO:
   * class CreateUserDto {
   *   @IsString()
   *   name: string;
   *
   *   @IsInt()
   *   age: number;
   * }
   *
   * Result:
   * - age -> converted to number (20)
   * - role -> rejected (not in DTO)
   * - name and age -> validated
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();