/* eslint-disable prettier/prettier */

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/db/schema';
import { UserInterface } from './interfaces/user.interface';


@Injectable()
export class TestsService {
  constructor(
    @Inject('DRIZZLE') private db: NodePgDatabase<typeof schema>,
  ) { }

  async create(user: UserInterface) {
    const result = await this.db.insert(schema?.usersTable)
      .values(user)
      .returning();
    if (!user) throw new NotFoundException('user create fail')
    return result;
  }

  async findAll() {
    const users = await this.db.query.usersTable.findMany();
    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} test`;
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return `This action updates a #${id} test`;
  }

  remove(id: number) {
    return `This action removes a #${id} test`;
  }
}
