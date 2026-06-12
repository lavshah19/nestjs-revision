import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.enity';
import { Repository } from 'typeorm';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class FileUploadService {

    constructor(
        @InjectRepository(FileEntity)
        private fileRepository: Repository<FileEntity>,
        private readonly cloudinaryService: CloudinaryService
    ) {}


    async uploadFile(file:Express.Multer.File,description:string | undefined,user:User):Promise<FileEntity>{
        const cloudinaryResponse=await this.cloudinaryService.uploadFile(file);
        const newlyCreatedFile=await this.fileRepository.create({
            originalname:file.originalname,
            mimetype:file.mimetype,
            size:file.size,
            url:cloudinaryResponse.secure_url,
            publicId:cloudinaryResponse.public_id,
            description:description,
            uploader:user
        })
        return this.fileRepository.save(newlyCreatedFile)
    }
    async removeFile(id:string){
      const deletedFile= await this.fileRepository.findOneBy({id:id})
      if(!deletedFile){
        throw new NotFoundException('File not found')
      }
      await this.cloudinaryService.removeFile(deletedFile.publicId)
      await this.fileRepository.remove(deletedFile)
    }
    async findAll():Promise<FileEntity[]>{
        return this.fileRepository.find()
    }
}
