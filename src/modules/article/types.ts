import { Prisma } from '@prisma/client';

export type CreateArticleType = Omit<
  Prisma.ArticleCreateInput,
  'id' | 'tags' | 'authors' | 'comments'
> & {
  tags?: string[];
  authors?: string[];
};

export type UpdateArticleType = Omit<
  Prisma.ArticleCreateInput,
  'id' | 'tags' | 'authors' | 'comments'
> & {
  tags?: string[];
  comments?: string[];
  authors?: string[];
};
