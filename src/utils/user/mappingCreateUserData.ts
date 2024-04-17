import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';
import { CreateUserType } from '@/types/user';
import * as bcrypt from 'bcrypt';

export const mappingCreateUserData = async (
  data: CreateUserType,
): Promise<Prisma.UserCreateInput> => {
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(data.password, salt);
  return {
    id: uuidv4(),
    email: data.email,
    role: data.role,
    name: data.name,
    hashPassword,
  };
};
