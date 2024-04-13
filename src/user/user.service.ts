import { v4 as uuidv4 } from 'uuid';
import { Body, Injectable, Param } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { CreateUserType } from '../types/user';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = this.prismaService.user.findMany();
    return users;
  }

  async findByName(name: string): Promise<User> {
    const user = this.prismaService.user.findUnique({
      where: {
        name,
      },
    });

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async create(body: CreateUserType): Promise<User> {
    const data: Prisma.UserCreateInput = {
      ...body,
      hashPassword: '',
      id: uuidv4(),
    };
    const user = await this.prismaService.user.create({ data });
    return user;
  }

  async remove(id: string): Promise<User> {
    const user = await this.prismaService.user.delete({
      where: {
        id,
      },
    });

    return user;
  }

  async update(id: string, body: Prisma.UserUpdateInput): Promise<User> {
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: body,
    });

    return user;
  }
}
