import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { CreateUserType, FindAllQueryParams } from '@/types/user';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findAll({
    id,
    name,
    role,
    email,
  }: FindAllQueryParams): Promise<User[]> {
    return this.prismaService.user.findMany({
      where: {
        id,
        email,
        name,
        role: role?.toUpperCase(),
      },
    });
  }

  async findById(id: string): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async create(body: CreateUserType): Promise<User> {
    const salt = await bcrypt.genSalt();

    const data = {
      id: uuidv4(),
      ...body,
    };

    return this.prismaService.user.create({ data });
  }

  async remove(id: string): Promise<User> {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  async update(id: string, body: Prisma.UserUpdateInput): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: body,
    });
  }
}
