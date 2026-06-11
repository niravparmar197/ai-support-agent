import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { CreateOrganizationWithOwnerDto } from './dto/create-organization-owner.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: createOrganizationDto,
    });
  }

  async createWithOwner(dto: CreateOrganizationWithOwnerDto) {
    // Hash password
    const hashedPassword = await bcrypt.hash(dto.ownerPassword, 10);

    return this.prisma.$transaction(async (tx) => {
      // 1. Verify email uniqueness
      const existingUser = await tx.user.findUnique({
        where: { email: dto.ownerEmail },
      });
      if (existingUser) {
        throw new ConflictException(`User with email ${dto.ownerEmail} already exists`);
      }

      // 2. Verify organization slug uniqueness
      const existingOrg = await tx.organization.findUnique({
        where: { slug: dto.orgSlug },
      });
      if (existingOrg) {
        throw new ConflictException(`Organization with slug ${dto.orgSlug} already exists`);
      }

      // 3. Create Organization
      const organization = await tx.organization.create({
        data: {
          name: dto.orgName,
          slug: dto.orgSlug,
        },
      });

      // 4. Create Owner User
      const owner = await tx.user.create({
        data: {
          name: dto.ownerName,
          email: dto.ownerEmail,
          password: hashedPassword,
          role: UserRole.ADMIN,
          organizationId: organization.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });

      return {
        organization,
        owner,
      };
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
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.organization.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const org = await this.prisma.organization.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!org) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return org;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    // Ensure it exists and is not soft-deleted
    await this.findOne(id);

    return this.prisma.organization.update({
      where: {
        id,
      },
      data: updateOrganizationDto,
    });
  }

  async remove(id: string) {
    // Ensure it exists and is not soft-deleted
    await this.findOne(id);

    return this.prisma.organization.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}