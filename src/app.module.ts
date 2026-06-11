import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/entities/post.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { ConfigModule } from '@nestjs/config';

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
      entities:[Post,User],
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 5000
    }),
     ConfigModule.forRoot({
      isGlobal: true,
    }),
    //isGlobal: true means you don't have to import ConfigModule in every module.
    PostsModule,
    
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
