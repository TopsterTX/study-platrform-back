import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Article } from '@prisma/client';
import { CreateArticleType, UpdateArticleType } from '@/modules/article/types';
import { CustomRequest } from '@/types';

@Injectable()
export class ArticleService {
  constructor(private prismaService: PrismaService) {}

  async findAll(query: Article): Promise<Article[]> {
    return this.prismaService.article.findMany({
      where: query,
    });
  }

  async create(
    payload: CreateArticleType,
    req: CustomRequest,
  ): Promise<Article> {
    const { tags = [], authors = [], ...body } = payload;
    const articleId: string = uuidv4();
    const connectAuthors = authors.concat(req?.user?.id).map((userId) => {
      return {
        articleId_userId: { userId, articleId },
      };
    });
    const currentTags = tags.map((tagId) => {
      return {
        articleId_tagId: { tagId, articleId },
      };
    });
    return this.prismaService.article.create({
      data: {
        id: articleId,
        ...body,
        tags: { connect: currentTags },
        authors: { connect: connectAuthors },
      },
    });
  }

  // Надо передавать актуальные списки тегов и авторов статьи
  // При передаче комментария, он добавиться к уже имеющимся
  async update(
    id: string,
    { authors = [], tags = [], comments = [], ...body }: UpdateArticleType,
  ): Promise<Article> {
    const currentTags = tags.map((tagId) => ({
      articleId_tagId: { tagId, articleId: id },
    }));
    const currentAuthors = authors.map((userId) => ({
      articleId_userId: { userId, articleId: id },
    }));
    const currentComments = comments.map((commentId) => ({
      id: commentId,
    }));
    return this.prismaService.article.update({
      data: {
        ...body,
        tags: { set: currentTags },
        authors: { set: currentAuthors },
        comments: { connect: currentComments },
      },
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<Article> {
    return this.prismaService.article.delete({
      where: { id },
    });
  }
}
