/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/entities/post.entity';
import { TestsModule } from './tests/tests.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { Product } from './products/entities/product.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env']
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL!,
      ssl: {
        rejectUnauthorized: true, // required for Neon
      },
      entities: [User, Post, Category, Product],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ThrottlerModule.forRoot({ // global rate limt 10 req for 1min
      throttlers: [
        { name: 'default', ttl: 60000, limit: 10 },
        { name: 'login', ttl: 60000, limit: 5 }
      ]
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 1000 * 60,
    })
    ,
    UsersModule,
    AuthModule,
    PostsModule,
    TestsModule,
    ProductsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule { }

