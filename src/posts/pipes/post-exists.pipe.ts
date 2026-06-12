// import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
// import { PostsService } from "../posts.service";

// @Injectable()
// export class PostExistsPipe implements PipeTransform{
//     constructor(
//         private readonly postsService: PostsService
//     ){}

//      transform(id: number, meta: ArgumentMetadata) {
//       try{
//         return this.postsService.findOne(id);
//       }catch(e){
//         throw new NotFoundException(`Post with id ${id} not found`);
//       }

//     }
// }
