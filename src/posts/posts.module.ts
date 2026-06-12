import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';

/**
 * PostsModule
 * ------------------------
 * This module handles everything related to "Posts" feature.
 * It groups controller, service, and database entity together.
 *
 * In NestJS, every feature is a module.
 */
@Module({
  imports: [
    /**
     * TypeOrmModule.forFeature([Post])
     * -----------------------------------
     * This registers the Post entity inside this module.
     *
     * It allows NestJS Dependency Injection (DI container) to:
     * - Create Repository<Post>
     * - Inject it into PostsService using @InjectRepository(Post)
     *
     * Without this, you CANNOT use Post repository in this module.
     */
    TypeOrmModule.forFeature([Post]),
    AuthModule,
  ],

  /**
   * Controllers handle incoming HTTP requests
   * Example:
   * GET /posts
   * POST /posts
   */
  controllers: [PostsController],

  /**
   * Providers are services that contain business logic
   * Example:
   * - create post
   * - fetch posts
   * - update post
   * - delete post
   */
  providers: [PostsService],
})
export class PostsModule {}
