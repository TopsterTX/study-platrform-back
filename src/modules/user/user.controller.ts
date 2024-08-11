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
  Req,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserType, FindAllQueryParams } from '@/modules';
import { AuthGuard, RolesGuard } from '@/guards';
import { UserService } from './user.service';
import { Roles } from '@/decorators';
import { JwtService } from '@nestjs/jwt';
import { CustomRequest } from '@/types';

@UseGuards(AuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('/me')
  async getData(@Req() request: CustomRequest) {
    return await this.userService.getData(request);
  }

  @Roles(['ADMIN'])
  @Get('')
  async findAll(@Query() query: FindAllQueryParams) {
    return await this.userService.findAll(query);
  }

  @Roles(['ADMIN'])
  @Get('/:id')
  async findById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Roles(['ADMIN'])
  @Post('/')
  async create(@Body() body: CreateUserType) {
    return await this.userService.create(body);
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
