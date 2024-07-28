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
import { CreateUserType, FindAllQueryParams } from '@/modules';
import { AuthGuard, RolesGuard } from '@/guards';
import { UserService } from './user.service';
import { Roles } from '@/decorators';

@UseGuards(AuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(['ADMIN'])
  @Get('')
  async findAll(@Query() query: FindAllQueryParams) {
    const users = await this.userService.findAll(query);
    return users;
  }

  @Roles(['ADMIN'])
  @Get('/:id')
  async findById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new HttpException('user is not defined', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  @Roles(['ADMIN'])
  @Post('/')
  async create(@Body() body: CreateUserType) {
    const user = await this.userService.create(body);
    return user;
  }

  @Roles(['ADMIN'])
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }

  @Roles(['ADMIN'])
  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: Prisma.UserUpdateInput) {
    return await this.userService.update(id, body);
  }
}
