import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      if (existingUser.deletedAt === null) {
        throw new ConflictException(`User with email ${createUserDto.email} already exists`);
      } else {
        // If soft-deleted, we can restore or throw an error. Let's throw conflict for now.
        throw new ConflictException(`User with email ${createUserDto.email} was previously deleted. Please restore or use a different email.`);
      }
    }

    // Verify organization exists
    const org = await this.prisma.organization.findFirst({
      where: { id: createUserDto.organizationId, deletedAt: null },
    });
    if (!org) {
      throw new NotFoundException(`Organization with ID ${createUserDto.organizationId} not found`);
    }

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    // Omit passwords from return
    const sanitizedItems = items.map(({ password, ...rest }) => rest);

    return {
      items: sanitizedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...rest } = user;
    return rest;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Verify user exists and not soft-deleted
    await this.findOne(id);

    if (updateUserDto.organizationId) {
      const org = await this.prisma.organization.findFirst({
        where: { id: updateUserDto.organizationId, deletedAt: null },
      });
      if (!org) {
        throw new NotFoundException(`Organization with ID ${updateUserDto.organizationId} not found`);
      }
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    const { password, ...rest } = updated;
    return rest;
  }

  async remove(id: string) {
    // Verify user exists and not soft-deleted
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async invite(inviteUserDto: InviteUserDto) {
    const tempPassword = `InvitedTempPass123!`;
    const createdUser = await this.create({
      name: inviteUserDto.name,
      email: inviteUserDto.email,
      password: tempPassword,
      organizationId: inviteUserDto.organizationId,
      role: inviteUserDto.role,
    });

    return {
      message: 'Invitation sent successfully (mocked)',
      user: createdUser,
    };
  }

  async updateStatus(id: string, status: UserStatus) {
    // Verify user exists and not soft-deleted
    await this.findOne(id);

    const updated = await this.prisma.user.update({
      where: { id },
      data: { status },
    });

    const { password, ...rest } = updated;
    return rest;
  }

  async updateRole(id: string, role: UserRole) {
    // Verify user exists and not soft-deleted
    await this.findOne(id);

    const updated = await this.prisma.user.update({
      where: { id },
      data: { role },
    });

    const { password, ...rest } = updated;
    return rest;
  }
}
