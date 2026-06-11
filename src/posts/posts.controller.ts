import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import type { Post as PostEntity } from './entities/post.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
// import { PostExistsPipe } from './pipes/post-exists.pipe';


 @UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    async getPosts(@Query("search") search: string): Promise<PostEntity[]> {
        return this.postsService.findAll(search);
    }


    @Get(':id')

    getPostBtId(@Param('id', ParseIntPipe) id:number): Promise<PostEntity> {
        return this.postsService.findOne(id);
        
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    // @UsePipes(
    //     new ValidationPipe({
    //         whitelist: true,
    //         forbidNonWhitelisted: true,
    //         transform: true,
    //         disableErrorMessages: false,
    //     })
    // )
    createPost(@Body() post: CreatePostDto,@CurrentUser() user: User): Promise<PostEntity> {
    
       return this.postsService.create(post,user);
    }

    @Put(':id')
    updatePost(@Param('id', ParseIntPipe) id:number, @Body() updatedPost: UpdatePostDto,@CurrentUser() user: User): Promise<PostEntity> {
        return this.postsService.update(id, updatedPost,user);
    }
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deletePost(@Param('id', ParseIntPipe) id:number,@CurrentUser() user: User): Promise<PostEntity> {
        return this.postsService.delete(id,user);
    }
}
