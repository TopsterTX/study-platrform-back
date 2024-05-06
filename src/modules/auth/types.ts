import { CreateUserType, Role } from '@/modules';

export type SignInBodyType = {
  email: string;
  password: string;
};

export type SignUpBodyType = Omit<CreateUserType, 'hashPassword' | 'role'> & {
  password: string;
  role: Role;
};

export type ChangePasswordBodyType = Pick<
  CreateUserType,
  'email' | 'secret'
> & {
  password: string;
};
