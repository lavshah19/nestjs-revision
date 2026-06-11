import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll(search: string): Promise<Post[]> {
    if (search) {
      return this.postsRepository.find({
        where: {
          title: search,
        },
        relations: {
          authorName: true,
        },
      });
    }
    return this.postsRepository.find({
      relations: {
        authorName: true,
      },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        authorName: true,
      },
    });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  async create(post: CreatePostDto, authorName: User): Promise<Post> {
    const newPost = this.postsRepository.create({
      title: post.title,
      content: post.content,
      authorName: authorName,
    });
    return this.postsRepository.save(newPost);
  }

  async update(
    id: number,
    updatedPost: UpdatePostDto,
    authorName: User,
  ): Promise<Post> {
    const post = await this.findOne(id);
    // only creator can update the post
    if (post.authorName.id !== authorName.id) {
      throw new ForbiddenException(`You are not allowed to update this post`);
    }

    Object.assign(post, updatedPost);

    return this.postsRepository.save(post);
  }

  async delete(id: number, authorName: User): Promise<Post> {
    const post = await this.findOne(id);

    // only creator can delete the post
    if (post.authorName.id !== authorName.id) {
      throw new ForbiddenException(`You are not allowed to delete this post`);
    }
    return this.postsRepository.remove(post);
  }
}
