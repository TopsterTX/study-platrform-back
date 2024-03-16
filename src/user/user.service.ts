import { Injectable } from '@nestjs/common';

type User = {
  id: string;
  name: string;
  password: string;
};

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      id: '12323',
      name: 'name',
      password: 'asdfsdfdfds',
    },
    {
      id: '55554',
      name: 'name1',
      password: '1asdfsdfdfds',
    },
  ];

  findByName(name: string) {
    return this.users.find(({ name: userName }) => userName === name);
  }
}
