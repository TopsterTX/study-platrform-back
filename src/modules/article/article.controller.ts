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
  Req,
} from '@nestjs/common';
import { Article } from '@prisma/client';
import { CustomRequest } from '@/types';
import { CreateArticleType, UpdateArticleType } from '@/modules';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('')
  async findAll(@Query() query: Article) {
    return this.articleService.findAll(query);
  }

  @HttpCode(201)
  @Post('')
  async create(@Body() article: CreateArticleType, @Req() req: CustomRequest) {
    return this.articleService.create(article, req);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: UpdateArticleType) {
    return this.articleService.update(id, body);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.articleService.remove(id);
  }
}
