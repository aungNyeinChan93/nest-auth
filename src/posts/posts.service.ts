/* eslint-disable prettier/prettier */


// import { * as bcrypt } from 'bcrypt';
import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ILike, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Pagination } from 'src/common/interfaces/pagination.interface';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

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
    await this.cacheManager.clear();
    return newPost;
  }

  async findAll(paginationDto: PaginationDto & Partial<{ title: string | undefined }>): Promise<Pagination<Post>> {

    const currentPage = Number(paginationDto?.page) || 1;
    const limit = Number(paginationDto?.limit) || 10;
    const skip = (currentPage - 1) * limit;

    const cacheKey = `posts:page=${currentPage}:limit=${limit}:title=${(paginationDto?.title ?? '')}`;  //cache key by URI

    const cachePosts = await this.cacheManager.get<Post[]>(cacheKey);

    if (!cachePosts) {
      const where = paginationDto?.title && paginationDto?.title.trim() !== ''
        ? { title: ILike(`%${paginationDto?.title?.trim()}%`) }
        : undefined;

      const [posts, totalPosts] = await this.postRepo.findAndCount({
        where,
        relations: { author: true },
        take: limit,
        skip,
        order: { created_at: 'DESC' }
      });

      const totalPage = Math.ceil(totalPosts == 0 ? 1 : totalPosts / limit);

      await this.cacheManager.set<Post[]>(cacheKey, posts)

      return this.generatePaginationResult<Post>({ currentPage, totalPage, limit, totalItems: totalPosts, items: posts });
    }

    const totalPosts = cachePosts?.length;
    const totalPage = Math.ceil(totalPosts == 0 ? 1 : totalPosts / limit);
    return this.generatePaginationResult<Post>({ currentPage, totalPage, totalItems: totalPosts, items: cachePosts, limit });

  }

  async findOne(id: number): Promise<Post> {
    const cacheKey = `post-${id}`;
    const cachePost = await this.cacheManager.get<Post>(cacheKey);

    if (cachePost) {
      console.log(cacheKey);
      return cachePost;
    };

    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['author']
    })

    if (!post) throw new NotFoundException("Post Not found!")

    await this.cacheManager.set<Post>(cacheKey, post)
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
    const updatePost = await this.findOne(id);
    if (updatePost?.author?.id !== user?.id) throw new UnauthorizedException('This post can not be update')
    const result = await this.postRepo.update(id, updatePostDto)
    if (result?.affected === 0) throw new ConflictException('Post Update fail');
    await this.cacheManager.clear();
    return this.findOne(id);
  }

  async remove(id: number, user: User) {
    const post = await this.findOne(id);
    if (post?.author?.id !== user?.id) throw new UnauthorizedException('You can not unauthorized! ')
    await this.postRepo.remove(post);
    await this.cacheManager.clear();
    return { message: `Post was successfully delete!` }
  }

  private generatePaginationResult<T>(result: Pagination<T>) {
    return { ...result }
  }

  async myPosts(user: User, paginationDto: PaginationDto): Promise<Pagination<Post>> {
    const currentPage = Number(paginationDto?.page) || 1;
    const limit = Number(paginationDto?.limit) || 10;
    const skip = (currentPage - 1) * limit;

    const cacheKey = `user_id - ${user?.id}`;

    const cachePosts = await this.cacheManager.get<{ posts: Post[], count: number }>(cacheKey);

    if (!cachePosts) {
      const [posts, totalPosts] = await this.postRepo.findAndCount({
        where: { author: { id: user?.id } },
        order: { created_at: 'DESC' },
        relations: { author: true },
        take: limit,
        skip
      });
      const totalPage = Math.max(1, Math.ceil(totalPosts / limit));

      await this.cacheManager.set<{ posts: Post[], count: number }>(cacheKey, { posts: posts, count: totalPosts });

      return this.generatePaginationResult<Post>({
        currentPage, limit, totalPage, totalItems: totalPosts, items: posts
      });
    }

    const totalPosts = cachePosts?.count;
    const totalPage = Math.max(1, Math.ceil(totalPosts / limit));

    console.log('cache');

    return this.generatePaginationResult({
      currentPage,
      limit,
      totalItems: totalPosts,
      totalPage,
      items: cachePosts?.posts
    })
  }
}
