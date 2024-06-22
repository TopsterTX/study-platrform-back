import { Reflector } from '@nestjs/core';
import { Role } from '@/modules';

export const Roles = Reflector.createDecorator<Role[]>();
