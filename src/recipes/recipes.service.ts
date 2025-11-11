/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RecipesService {
  constructor(
    private readonly axios: HttpService
  ) { };

  create(createRecipeDto: CreateRecipeDto) {
    return 'This action adds a new recipe';
  }

  findAll() {
    return `This action returns all recipes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recipe`;
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }

  async fetchRecipes() {
    const response = this.axios.get('https://dummyjson.com/recipes')
    const recipes = await firstValueFrom(response);
    return recipes?.data;
  }
}
