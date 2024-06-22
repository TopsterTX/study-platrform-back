import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Comment } from '@prisma/client';
import { CreateCommentType, UpdateCommentType } from '@/modules';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: Comment): Promise<Comment[]> {
    return this.prismaService.comment.findMany({
      where: query,
    });
  }

  async create({
    userId,
    articleId,
    ...body
  }: CreateCommentType): Promise<Comment> {
    return this.prismaService.comment.create({
      data: {
        ...body,
        user: { connect: { id: userId } },
        article: { connect: { id: articleId } },
      },
    });
  }

  async update(id: string, body: UpdateCommentType): Promise<Comment> {
    return this.prismaService.comment.update({
      data: body,
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<Comment> {
    return this.prismaService.comment.delete({
      where: { id },
    });
  }
}
