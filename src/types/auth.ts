import { CreateUserType } from '@/types/user';

export type SignInBodyType = {
  email: string;
  password: string;
};

export type SignUpBodyType = Omit<CreateUserType, 'hashPassword' | 'role'> & {
  password: string;
};
