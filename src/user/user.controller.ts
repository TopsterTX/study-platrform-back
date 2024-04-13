import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserService } from 'user/user.service';
import { CreateUserType } from '../types/user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }

  @Get('/:name')
  async findById(@Param('name') name: string) {
    const user = await this.userService.findByName(name);
    return user;
  }

  @Post('/')
  async create(@Body() body: CreateUserType) {
    const user = await this.userService.create(body);
    return user;
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.remove(id);
    return user;
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: Prisma.UserUpdateInput) {
    const user = await this.userService.update(id, body);
    return user;
  }
}
