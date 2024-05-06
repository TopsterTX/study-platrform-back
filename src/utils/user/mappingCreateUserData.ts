import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';
import { Role, SignUpBodyType } from '@/modules';

export const mappingCreateUserData = (
  data: SignUpBodyType,
  { role, hashPassword }: { role: Role; hashPassword: string },
): Prisma.UserCreateInput => {
  const { email, name, password: _password, ...rest } = data;
  return {
    id: uuidv4(),
    email,
    role,
    name,
    hashPassword,
    ...rest,
  };
};
