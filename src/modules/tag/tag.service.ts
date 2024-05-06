import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Tag, Prisma } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: Tag): Promise<Tag[]> {
    return this.prismaService.tag.findMany({
      where: query,
      include: {
        articles: true,
      },
    });
  }

  async create(body: Prisma.TagCreateInput): Promise<Tag> {
    return this.prismaService.tag.create({ data: body });
  }

  async update(id: string, body: Prisma.TagUpdateInput): Promise<Tag> {
    return this.prismaService.tag.update({
      data: body,
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<Tag> {
    return this.prismaService.tag.delete({
      where: { id },
    });
  }
}
