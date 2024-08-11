import { v4 as uuidv4 } from 'uuid';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { CreateUserType, FindAllQueryParams } from './types';
import { User, Prisma } from '@prisma/client';
import { TokenDecoder } from '@/utils';
import { CustomRequest } from '@/types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

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

  async getData(request: CustomRequest): Promise<User> {
    const token = request.cookies['access_token'];
    const { id } = await this.jwtService.decode(token);
    if (!id) {
      throw new NotAcceptableException('user is not defined');
    }
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('user is not defined');
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new BadRequestException('user is not defined');
    }

    return user;
  }

  async create(body: CreateUserType): Promise<User> {
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
