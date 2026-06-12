import { Inject, Injectable } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import * as streamifier from 'streamifier'



@Injectable()
export class CloudinaryService {
    constructor(
        @Inject('Cloudinary')
         private readonly cloudinary
    ) { }

    uploadFile(file:  Express.Multer.File):Promise<UploadApiResponse>{
        return new Promise((resolve,reject)=>{
            const uploadStream=this.cloudinary.uploader.upload_stream({
                folder:'myfolder',
                resource_type:'auto',
            },
            (error:UploadApiErrorResponse,result:UploadApiResponse)=>{
                if(error) reject(error)
                resolve(result)
            }
            )
            //convert the file buffer to readable stream 
           streamifier.createReadStream(file.buffer).pipe(uploadStream)
        })
    }

    async removeFile(publicId:string){
        return this.cloudinary.uploader.destroy(publicId)
    }
}