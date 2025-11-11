/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */


import { Injectable } from '@nestjs/common';
import { CreateUploadImageDto } from './dto/create-upload-image.dto';
import { UpdateUploadImageDto } from './dto/update-upload-image.dto';
import path from 'node:path';
import fs from 'node:fs'

@Injectable()
export class UploadImageService {
  create(createUploadImageDto: CreateUploadImageDto) {
    return 'This action adds a new uploadImage';
  }

  findAll() {
    return `This action returns all uploadImage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uploadImage`;
  }

  update(id: number, updateUploadImageDto: UpdateUploadImageDto) {
    return `This action updates a #${id} uploadImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} uploadImage`;
  }

  async singleUpload(image: Express.Multer.File) {
    const fileName = `${crypto.randomUUID()}-${image.originalname}`;
    const filePath = path.join(process.cwd(), 'public', 'images', fileName);
    const urlPath = path.join('images', fileName)

    await fs.promises.writeFile(filePath, image?.buffer, { encoding: 'utf-8' });

    return { fileName, urlPath };
  }
}
