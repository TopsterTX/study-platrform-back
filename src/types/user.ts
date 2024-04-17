import { User } from '@prisma/client';

export type CreateUserType = Omit<User, 'hashPassword' | 'id'> & {
  password: string;
};

export type FindAllQueryParams = Partial<User>;
