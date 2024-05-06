import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Tag, Prisma } from '@prisma/client';
import { TagService } from './tag.service';
import { Roles } from '@/decorators';
import { AuthGuard, RolesGuard } from '@/guards';

@UseGuards(AuthGuard, RolesGuard)
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('')
  async findAll(@Query() query: Tag) {
    return this.tagService.findAll(query);
  }

  @Roles(['ADMIN'])
  @HttpCode(201)
  @Post('')
  async create(@Body() body: Prisma.TagCreateInput) {
    return this.tagService.create(body);
  }

  @Roles(['ADMIN'])
  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: Prisma.TagUpdateInput) {
    return this.tagService.update(id, body);
  }

  @Roles(['ADMIN'])
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}
