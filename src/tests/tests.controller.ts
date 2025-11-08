/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test } from './decorators/test-decorator';
import { TestGuard } from './guard/testguard';
import { TestRolesGuard } from './guard/test-roles.guard';
import { TestRoles } from './decorators/test-roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) { }

  @Post()
  create(@Body() createTestDto: CreateTestDto) {
    return this.testsService.create(createTestDto);
  }

  @Get()
  findAll() {
    return this.testsService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testsService.update(+id, updateTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testsService.remove(+id);
  }

  @UseGuards(TestGuard)
  @Get('test-one')
  testOne(@Test() user: unknown) {
    return user;
  }

  @UseGuards(TestGuard)
  @Get('test-two')
  testTwo(@Test('id') id: string) {
    return id;
  }

  @UseGuards(TestGuard, TestRolesGuard)
  @TestRoles(UserRole.GUEST)
  @Get('test-three')
  testThree() {
    return 'this is only for guest user'
  }
}
