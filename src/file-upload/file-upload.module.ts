import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { FileEntity } from './entities/file.enity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    CloudinaryModule,
    MulterModule.register({
      storage: memoryStorage()
    }),
    AuthModule
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService]
})
export class FileUploadModule {}
