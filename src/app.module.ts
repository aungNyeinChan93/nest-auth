/* eslint-disable prettier/prettier */

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { UploadImageModule } from './upload-image/upload-image.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { HttpModule } from '@nestjs/axios'
import { RecipesModule } from './recipes/recipes.module';
import { EventsModule } from './events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from './mail/mail.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { UsersController } from './users/users.controller';
import { TestMiddleware } from './common/middlewares/test.middleware';

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
      autoLoadEntities: true,
      entities: [User, Post, Category, Product],
      synchronize: true,
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
    }),

    HttpModule.register({
      timeout: 5000,
      allowAbsoluteUrls: true,
    }),

    EventEmitterModule.forRoot({
      global: true,
    }),


    AuthModule,
    EventsModule,
    UsersModule,
    PostsModule,
    TestsModule,
    ProductsModule,
    CategoriesModule,
    UploadImageModule,
    DrizzleModule,
    RecipesModule,
    MailModule,


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
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
      // .forRoutes({ path: '*', method: RequestMethod.ALL })
      .forRoutes(UsersController)
  }

}

