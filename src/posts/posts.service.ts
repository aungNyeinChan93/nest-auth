/* eslint-disable prettier/prettier */


import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
  ) { };

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepo.create({ ...createPostDto, created_at: new Date() });
    if (!post) throw new ConflictException('Post create fail!')
    const newPost = await this.postRepo.save(post);
    return newPost;
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepo.find();
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { id } })
    if (!post) throw new NotFoundException("Post Not found!")
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const result = await this.postRepo.update(id, updatePostDto)
    if (result?.affected === 0) throw new ConflictException('Post Update fail')
    return this.findOne(id);
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    await this.postRepo.remove(post);
    return { message: `Post was successfully delete!` }
  }
}
