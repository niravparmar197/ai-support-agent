import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesService {
  findAll() {
    return Object.values(UserRole);
  }
}
