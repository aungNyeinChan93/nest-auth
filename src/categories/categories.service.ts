/* eslint-disable prettier/prettier */

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) { }


  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepo.create({ ...createCategoryDto, created_at: new Date() });
    const newCategory = await this.categoryRepo.save(category);
    if (!newCategory) throw new ConflictException('Category create fail!')
    return newCategory;
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepo.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('CATEGORY NOT FOUND!')
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const result = await this.categoryRepo.update(id, updateCategoryDto);
    if (result.affected === 0) throw new ConflictException('Category update fail!')
    return await this.findOne(id);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Category not found!')
    await this.categoryRepo.remove(category);
    return { message: 'category successfully deleted!' }
  }
}
