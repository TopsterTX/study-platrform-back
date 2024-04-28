import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserType, FindAllQueryParams } from '@/types';
import { AuthGuard } from '@/guards';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('')
  async findAll(@Query() query: FindAllQueryParams) {
    const users = await this.userService.findAll(query);
    return users;
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new HttpException('user is not defined', HttpStatus.BAD_REQUEST);
    }
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
