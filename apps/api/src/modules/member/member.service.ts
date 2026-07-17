import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { QueryMemberDto } from './dto/query-member.dto';
import { CreateBodyMetricDto } from './dto/create-body-metric.dto';
import { UserRole, Prisma } from '@prisma/client';

@Injectable()
export class MemberService {
  private readonly logger = new Logger(MemberService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMemberDto, tenantId: string) {
    // Check if user with this email already exists in the tenant
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dto.email, tenantId },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists in this gym');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Create user + member profile in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          role: UserRole.MEMBER,
          tenantId,
        },
      });

      const member = await tx.member.create({
        data: {
          userId: user.id,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
          gender: dto.gender,
          emergencyContact: dto.emergencyContact,
          healthNotes: dto.healthNotes,
          height: dto.height,
          weight: dto.weight,
        },
        include: {
          user: {
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
          },
        },
      });

      return member;
    });

    this.logger.log(`Member created: ${dto.email} in tenant ${tenantId}`);
    return result;
  }

  async findAll(tenantId: string, query: QueryMemberDto) {
    const { search, status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    // Build where clause — members belong to a tenant via User.tenantId
    const where: Prisma.MemberWhereInput = {
      user: {
        tenantId,
        isActive: true,
        ...(search
          ? {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      ...(status
        ? {
            subscription: {
              status: status as any,
            },
          }
        : {}),
    };

    const [members, total] = await Promise.all([
      this.prisma.member.findMany({
        where,
        skip,
        take: limit,
        orderBy: { joinDate: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              avatar: true,
              isActive: true,
              createdAt: true,
            },
          },
          subscription: {
            include: {
              plan: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  currency: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.member.count({ where }),
    ]);

    return {
      data: members,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, tenantId: string) {
    const member = await this.prisma.member.findFirst({
      where: {
        id,
        user: { tenantId },
      },
      include: {
        user: {
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
          },
        },
        subscription: {
          include: {
            plan: true,
            payments: {
              orderBy: { createdAt: 'desc' },
              take: 5,
            },
          },
        },
        bodyMetrics: {
          orderBy: { recordedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  async update(id: string, tenantId: string, dto: UpdateMemberDto) {
    const member = await this.findOne(id, tenantId);

    const updatedMember = await this.prisma.member.update({
      where: { id: member.id },
      data: {
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender,
        emergencyContact: dto.emergencyContact,
        healthNotes: dto.healthNotes,
        height: dto.height,
        weight: dto.weight,
        user: {
          update: {
            ...(dto.firstName ? { firstName: dto.firstName } : {}),
            ...(dto.lastName ? { lastName: dto.lastName } : {}),
            ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
            isActive: true,
            updatedAt: true,
          },
        },
      },
    });

    this.logger.log(`Member updated: ${id}`);
    return updatedMember;
  }

  async remove(id: string, tenantId: string) {
    const member = await this.findOne(id, tenantId);

    // Soft delete — deactivate the associated user
    await this.prisma.user.update({
      where: { id: member.user.id },
      data: { isActive: false },
    });

    this.logger.log(`Member soft-deleted: ${id}`);
    return { message: 'Member deactivated successfully' };
  }

  async getBodyMetrics(id: string, tenantId: string) {
    // Verify member belongs to tenant
    await this.findOne(id, tenantId);

    const metrics = await this.prisma.bodyMetric.findMany({
      where: { memberId: id },
      orderBy: { recordedAt: 'desc' },
    });

    return metrics;
  }

  async addBodyMetric(id: string, tenantId: string, dto: CreateBodyMetricDto) {
    // Verify member belongs to tenant
    await this.findOne(id, tenantId);

    const metric = await this.prisma.bodyMetric.create({
      data: {
        memberId: id,
        weight: dto.weight,
        bodyFat: dto.bodyFat,
        muscleMass: dto.muscleMass,
        chest: dto.chest,
        waist: dto.waist,
        hips: dto.hips,
        arms: dto.arms,
        thighs: dto.thighs,
      },
    });

    // Also update member's current weight/bodyFat if provided
    if (dto.weight || dto.bodyFat) {
      await this.prisma.member.update({
        where: { id },
        data: {
          ...(dto.weight ? { weight: dto.weight } : {}),
          ...(dto.bodyFat ? { bodyFat: dto.bodyFat } : {}),
        },
      });
    }

    this.logger.log(`Body metric added for member: ${id}`);
    return metric;
  }
}
