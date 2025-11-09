/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
// import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
  imports: [
    TypeOrmModule.forFeature([Post]),
    // PassportModule.register({})
  ]
})
export class PostsModule { }
