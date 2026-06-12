import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './dto/upload-file.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { FileEntity } from './entities/file.enity';
@UseGuards(JwtAuthGuard)
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file')) // this will intercept the file and save it to the disk
  async uploadFile(
    @Body() dto: UploadFileDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ): Promise<FileEntity> {
    if (!file) throw new NotFoundException('File not found');
    return this.fileUploadService.uploadFile(file, dto.description, user);
  }
  @Get()
  async findAll(): Promise<FileEntity[]> {
    return this.fileUploadService.findAll();
  }
  @Delete(':id')
  async removeFile(@Param('id') id: string) {
    return this.fileUploadService.removeFile(id);
  }
}
