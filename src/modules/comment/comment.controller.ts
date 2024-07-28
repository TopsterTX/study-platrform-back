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
import { CreateCommentType, UpdateCommentType } from '@/modules';
import { Comment, Prisma } from '@prisma/client';
import { CommentService } from './comment.service';
import { AuthGuard, RolesGuard } from '@/guards';

@UseGuards(AuthGuard, RolesGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('')
  async findAll(@Query() query: Comment) {
    return this.commentService.findAll(query);
  }

  @HttpCode(201)
  @Post('')
  async create(@Body() body: CreateCommentType) {
    return this.commentService.create(body);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: UpdateCommentType) {
    return this.commentService.update(id, body);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
