import { Role } from './role';

export type UserType = {
  id: string;
  name: string;
  email: string;
  password: string;
  hashPassword: string;
  role: Role;
};

export type CreateUserType = Omit<UserType, 'hashPassword' | 'id'>;
