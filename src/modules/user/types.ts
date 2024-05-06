import { Prisma, User } from '@prisma/client';

export type Role = 'USER' | 'ADMIN' | 'AUTHOR';
export type CreateUserType = Omit<Prisma.UserCreateInput, 'id'>;
export type FindAllQueryParams = Partial<User>;
