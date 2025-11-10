/* eslint-disable prettier/prettier */


import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Pagination } from 'src/common/interfaces/pagination.interface';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { waitForDebugger } from 'inspector';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { };

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const post = this.postRepo.create({ ...createPostDto, created_at: new Date(), author: user });
    if (!post) throw new ConflictException('Post create fail!')
    const newPost = await this.postRepo.save(post);
    return newPost;
  }

  async findAll(paginationDto: PaginationDto): Promise<Pagination<Post>> {
    const currentPage = Number(paginationDto?.page) || 1;
    const limit = Number(paginationDto?.limit) || 10;
    const skip = (currentPage - 1) * limit;

    const cachePosts = await this.cacheManager.get<Post[]>('posts');

    if (!cachePosts) {
      const [posts, totalPosts] = await this.postRepo.findAndCount({
        relations: { author: true },
        take: limit,
        skip
      });
      await this.cacheManager.set<Post[]>('posts', posts)
      const totalPage = Math.ceil(totalPosts == 0 ? 1 : totalPosts / limit);
      return this.generatePaginationResult<Post>({ currentPage, totalPage, limit, totalItems: totalPosts, items: posts });
    }

    const totalPosts = cachePosts?.length;
    const totalPage = Math.ceil(totalPosts == 0 ? 1 : totalPosts / limit);
    return this.generatePaginationResult<Post>({ currentPage, totalPage, totalItems: totalPosts, items: cachePosts, limit });

  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['author']
    })
    if (!post) throw new NotFoundException("Post Not found!")
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
    const updatePost = await this.findOne(id);
    if (updatePost?.author?.id !== user?.id) throw new UnauthorizedException('This post can not be update')
    const result = await this.postRepo.update(id, updatePostDto)
    if (result?.affected === 0) throw new ConflictException('Post Update fail')
    return this.findOne(id);
  }

  async remove(id: number, user: User) {
    const post = await this.findOne(id);
    if (post?.author?.id !== user?.id) throw new UnauthorizedException('You can not unauthorized! ')
    await this.postRepo.remove(post);
    return { message: `Post was successfully delete!` }
  }

  private generatePaginationResult<T>(result: Pagination<T>) {
    return { ...result }
  }
}
