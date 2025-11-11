/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { CreateUploadImageDto } from './dto/create-upload-image.dto';
import { UpdateUploadImageDto } from './dto/update-upload-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('upload-image')
export class UploadImageController {
  constructor(
    private readonly uploadImageService: UploadImageService,

  ) { }

  @Post()
  create(@Body() createUploadImageDto: CreateUploadImageDto) {
    return this.uploadImageService.create(createUploadImageDto);
  }

  @Get()
  findAll() {
    return this.uploadImageService.findAll();
  }


  // Single File Upload
  @Post('single')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/images',
      filename(req, file, callback) {
        const fileName = `${Date.now()}-chan-${file?.originalname}`
        callback(null, fileName)
      },
    })
  }))
  singleUpload(@UploadedFile() image: Express.Multer.File) {
    const imageUrl = `/images/${image?.filename}`;
    return { message: 'File uploaded successfully', imageUrl };
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadImageService.findOne(+id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadImageDto: UpdateUploadImageDto) {
    return this.uploadImageService.update(+id, updateUploadImageDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadImageService.remove(+id);
  }


}
