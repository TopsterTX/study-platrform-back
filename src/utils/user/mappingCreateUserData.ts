import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Role, SignUpBodyType } from '@/types';

export const mappingCreateUserData = (
  data: SignUpBodyType,
  { role, hashPassword }: { role: Role; hashPassword: string },
): Prisma.UserCreateInput => {
  return {
    id: uuidv4(),
    email: data.email,
    role,
    name: data.name,
    hashPassword,
  };
};
