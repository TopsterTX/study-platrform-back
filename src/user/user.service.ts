import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { CreateUserType, FindAllQueryParams } from '@/types/user';
import { PrismaService } from '@/prisma.service';
import { mappingCreateUserData } from '@/utils/user/mappingCreateUserData';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findAll({
    name,
    id,
    role,
    email,
  }: FindAllQueryParams): Promise<User[]> {
    return this.prismaService.user.findMany({
      where: {
        name,
        id,
        role: role?.toUpperCase(),
        email,
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
    const { password } = body;
    const salt = await bcrypt.genSalt();

    const data = await mappingCreateUserData(body);

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
