import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantService {
  private readonly logger = new Logger(TenantService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTenantDto) {
    const existing = await this.prisma.tenant.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException('Tenant with this slug already exists');
    }

    const tenant = await this.prisma.tenant.create({
      data: dto,
    });

    this.logger.log(`Tenant created: ${tenant.name} (${tenant.slug})`);
    return tenant;
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [tenants, total] = await Promise.all([
      this.prisma.tenant.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          primaryColor: true,
          email: true,
          phone: true,
          isActive: true,
          plan: true,
          createdAt: true,
          _count: {
            select: { users: true, classes: true },
          },
        },
      }),
      this.prisma.tenant.count(),
    ]);

    return {
      data: tenants,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            classes: true,
            membershipPlans: true,
            workouts: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async findBySlug(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        primaryColor: true,
        address: true,
        phone: true,
        email: true,
        isActive: true,
        plan: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async update(id: string, dto: UpdateTenantDto) {
    await this.findOne(id);

    if (dto.slug) {
      const existing = await this.prisma.tenant.findFirst({
        where: { slug: dto.slug, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException('Slug already taken');
      }
    }

    return this.prisma.tenant.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.tenant.update({
      where: { id },
      data: { isActive: false },
    });

    this.logger.log(`Tenant deactivated: ${id}`);
    return { message: 'Tenant deactivated successfully' };
  }
}
