import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/entities/post.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { FileUploadModule } from './file-upload/file-upload.module';
import { FileEntity } from './file-upload/entities/file.enity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsModule } from './events/events.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'lav',
      password: 'qwerty56',
      database: 'nestdb',
      // autoLoadEntities: true,
      entities: [Post, User,FileEntity],
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 5000,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60000,
      max: 100, // this is the maximum number of items in the cache
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 30000,
          limit: 5,
        },
        // in futre i will used docker + redis instead of in-memory
      ],
    }),
    //isGlobal: true means you don't have to import ConfigModule in every module.
    EventEmitterModule.forRoot({
      global: true,
      wildcard: false,
      maxListeners: 15,
      verboseMemoryLeak: true,
    }),
    PostsModule,

    AuthModule,

    FileUploadModule,

    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer:MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
