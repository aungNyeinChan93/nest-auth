/* eslint-disable prettier/prettier */


import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
  imports: [
    TypeOrmModule.forFeature([Category]),
    PassportModule
  ]
})
export class CategoriesModule { }
