import { User } from '@prisma/client';
import { Request } from 'express';

export type CustomRequest = Request & {
  user: User;
};
