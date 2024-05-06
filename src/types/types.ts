import { User } from '@prisma/client';

export type CustomRequest = Request & {
  user: User;
};
