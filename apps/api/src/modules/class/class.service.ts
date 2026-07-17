import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassService {
  private readonly logger = new Logger(ClassService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClassDto, tenantId: string) {
    // Verify trainer exists and belongs to tenant
    const trainer = await this.prisma.trainer.findFirst({
      where: {
        id: dto.trainerId,
        user: { tenantId },
      },
    });

    if (!trainer) {
      throw new NotFoundException('Trainer not found in this gym');
    }

    // Validate start time is before end time
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    const gymClass = await this.prisma.class.create({
      data: {
        tenantId,
        trainerId: dto.trainerId,
        name: dto.name,
        description: dto.description,
        type: dto.type,
        startTime,
        endTime,
        recurrence: dto.recurrence,
        maxCapacity: dto.maxCapacity,
        location: dto.location,
      },
      include: {
        trainer: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    this.logger.log(`Class created: ${gymClass.name} in tenant ${tenantId}`);
    return gymClass;
  }

  async findAll(
    tenantId: string,
    startDate?: string,
    endDate?: string,
    page = 1,
    limit = 20,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
      tenantId,
      isActive: true,
    };

    // Date range filter
    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) {
        where.startTime.gte = new Date(startDate);
      }
      if (endDate) {
        where.startTime.lte = new Date(endDate);
      }
    }

    const [classes, total] = await Promise.all([
      this.prisma.class.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startTime: 'asc' },
        include: {
          trainer: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
          _count: {
            select: { bookings: true },
          },
        },
      }),
      this.prisma.class.count({ where }),
    ]);

    return {
      data: classes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, tenantId: string) {
    const gymClass = await this.prisma.class.findFirst({
      where: { id, tenantId },
      include: {
        trainer: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                email: true,
              },
            },
          },
        },
        bookings: {
          where: {
            status: { in: ['CONFIRMED', 'WAITLISTED'] },
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: { bookedAt: 'asc' },
        },
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!gymClass) {
      throw new NotFoundException('Class not found');
    }

    return gymClass;
  }

  async update(id: string, tenantId: string, dto: UpdateClassDto) {
    await this.findOne(id, tenantId);

    // If trainer is being changed, verify new trainer exists in tenant
    if (dto.trainerId) {
      const trainer = await this.prisma.trainer.findFirst({
        where: {
          id: dto.trainerId,
          user: { tenantId },
        },
      });
      if (!trainer) {
        throw new NotFoundException('Trainer not found in this gym');
      }
    }

    // Validate times if both are provided
    if (dto.startTime && dto.endTime) {
      if (new Date(dto.startTime) >= new Date(dto.endTime)) {
        throw new BadRequestException('Start time must be before end time');
      }
    }

    const gymClass = await this.prisma.class.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.type !== undefined ? { type: dto.type } : {}),
        ...(dto.trainerId !== undefined ? { trainerId: dto.trainerId } : {}),
        ...(dto.startTime !== undefined ? { startTime: new Date(dto.startTime) } : {}),
        ...(dto.endTime !== undefined ? { endTime: new Date(dto.endTime) } : {}),
        ...(dto.recurrence !== undefined ? { recurrence: dto.recurrence } : {}),
        ...(dto.maxCapacity !== undefined ? { maxCapacity: dto.maxCapacity } : {}),
        ...(dto.location !== undefined ? { location: dto.location } : {}),
      },
      include: {
        trainer: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    this.logger.log(`Class updated: ${id}`);
    return gymClass;
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    await this.prisma.class.update({
      where: { id },
      data: { isActive: false },
    });

    this.logger.log(`Class deactivated: ${id}`);
    return { message: 'Class deactivated successfully' };
  }
}
