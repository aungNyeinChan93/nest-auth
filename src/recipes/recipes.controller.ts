/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ConflictException } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly axios: HttpService,

  ) { }

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(+id, updateRecipeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipesService.remove(+id);
  }

  // @Get('fetch-recipes')
  // fetchRecipes() {
  //   return this.recipesService.fetchRecipes();
  // }

  @Post('save-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {

    const formData = new FormData();
    formData.append('image', file?.buffer, file?.originalname);
    const { data } = await firstValueFrom(this.axios.post('http://localhost:3000/upload-image/single', formData,
      {
        headers: {
          ...formData.getHeaders(), // <-- THIS IS THE MAGIC!
        },
      },
    ))
    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(+id);
  }
}
