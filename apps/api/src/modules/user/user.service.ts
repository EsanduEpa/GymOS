import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto, tenantId: string) {
    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email, tenantId },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists in this tenant');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: dto.role,
        tenantId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        tenantId: true,
        createdAt: true,
      },
    });

    // Create profile based on role
    if (dto.role === UserRole.MEMBER) {
      await this.prisma.member.create({ data: { userId: user.id } });
    } else if (dto.role === UserRole.TRAINER) {
      await this.prisma.trainer.create({
        data: { userId: user.id, specializations: [], certifications: [] },
      });
    }

    return user;
  }

  async findAll(tenantId: string, page = 1, limit = 20, role?: UserRole) {
    const skip = (page - 1) * limit;
    const where = {
      tenantId,
      ...(role ? { role } : {}),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, tenantId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
        memberProfile: true,
        trainerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, tenantId: string, dto: UpdateUserDto) {
    await this.findOne(id, tenantId);

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'User deactivated successfully' };
  }
}
