import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FindPostQueryDto } from './dto/find-post-query.dto';
import { PaginationResponse } from 'src/common/interfaces/pagination-responseinterface.';

@Injectable()
export class PostsService {
  private postListCacheKeys: Set<string> = new Set();
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private generatePostListCacheKey(query: FindPostQueryDto): string {
    const { title, page = 1, limit = 10 } = query;

    return `post-list-${title || 'all'}-${page}-${limit}`;
  }

  async findAll(query: FindPostQueryDto): Promise<PaginationResponse<Post>> {
    const cacheKey = this.generatePostListCacheKey(query);
    const cachedPostList =
      await this.cacheManager.get<PaginationResponse<Post>>(cacheKey);
    this.postListCacheKeys.add(cacheKey);
    if (cachedPostList) {
      console.log('cache hit');
      return cachedPostList;
    }
    console.log('cache miss');
    const { title, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const [posts, total] = await this.postsRepository.findAndCount({
      where: title ? { title } : {},
      relations: {
        authorName: true,
      },
      take: limit,
      skip,
    });
    const paginationResponse: PaginationResponse<Post> = {
      data: posts,
      meta: {
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasPreviousPage: page > 1,
        hasNextPage: page < Math.ceil(total / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    };
    await this.cacheManager.set(cacheKey, paginationResponse, 30000);
    return paginationResponse;
  }

  async findOne(id: number): Promise<Post> {
    const cacheKey = `post-${id}`;
    if (this.postListCacheKeys.has(cacheKey)) {
      const cachedPost = await this.cacheManager.get<Post>(cacheKey);
      if (cachedPost) {
        console.log('cache hit');
        return cachedPost;
      }
    }
    console.log('cache miss');
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        authorName: true,
      },
    });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    this.postListCacheKeys.add(cacheKey);

    await this.cacheManager.set(cacheKey, post, 30000);
    return post;
  }

  async create(post: CreatePostDto, authorName: User): Promise<Post> {
    const newPost = this.postsRepository.create({
      title: post.title,
      content: post.content,
      authorName: authorName,
    });
    // invaliadte tge existing cache
    await this.invalidateAllExistingListCache();
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
    await this.cacheManager.del(`post-${id}`);
    await this.invalidateAllExistingListCache();
    return this.postsRepository.save(post);
  }

  async delete(id: number, authorName: User): Promise<Post> {
    const post = await this.findOne(id);

    // only creator can delete the post
    if (post.authorName.id !== authorName.id) {
      throw new ForbiddenException(`You are not allowed to delete this post`);
    }

    await this.cacheManager.del(`post-${id}`);
    await this.invalidateAllExistingListCache();
    return this.postsRepository.remove(post);
  }
  private async invalidateAllExistingListCache() {
    console.log('invaliadting all existing list cache');
    for (const cacheKey of this.postListCacheKeys) {
      await this.cacheManager.del(cacheKey);
    }
    this.postListCacheKeys.clear();
  }
}
