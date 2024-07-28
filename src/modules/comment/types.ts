import { Prisma } from '@prisma/client';

export type CreateCommentType = Omit<
  Prisma.CommentCreateInput,
  'id' | 'user' | 'article'
> & {
  userId: string;
  articleId: string;
};

export type UpdateCommentType = Omit<
  Prisma.CommentUpdateInput,
  'id' | 'user' | 'article'
>;
