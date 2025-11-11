/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService],
  imports: [HttpModule]
})
export class RecipesModule { }
