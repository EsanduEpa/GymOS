import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookingDto, userId: string, tenantId: string) {
    // Verify the class exists and belongs to the tenant
    const gymClass = await this.prisma.class.findFirst({
      where: {
        id: dto.classId,
        tenantId,
        isActive: true,
      },
    });

    if (!gymClass) {
      throw new NotFoundException('Class not found or inactive');
    }

    // Check if class start time is in the future
    if (gymClass.startTime <= new Date()) {
      throw new BadRequestException('Cannot book a class that has already started');
    }

    // Check for double booking
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        userId,
        classId: dto.classId,
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.WAITLISTED] },
      },
    });

    if (existingBooking) {
      throw new ConflictException('You have already booked this class');
    }

    // Check capacity — count only CONFIRMED bookings
    const confirmedCount = await this.prisma.booking.count({
      where: {
        classId: dto.classId,
        status: BookingStatus.CONFIRMED,
      },
    });

    const isFull = confirmedCount >= gymClass.maxCapacity;
    const bookingStatus = isFull
      ? BookingStatus.WAITLISTED
      : BookingStatus.CONFIRMED;

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        userId,
        classId: dto.classId,
        status: bookingStatus,
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            startTime: true,
            endTime: true,
            location: true,
            maxCapacity: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Update class current count if confirmed
    if (bookingStatus === BookingStatus.CONFIRMED) {
      await this.prisma.class.update({
        where: { id: dto.classId },
        data: { currentCount: { increment: 1 } },
      });
    }

    this.logger.log(
      `Booking ${bookingStatus}: user ${userId} for class ${dto.classId}`,
    );

    return {
      ...booking,
      message: isFull
        ? 'Class is full. You have been added to the waitlist.'
        : 'Booking confirmed successfully.',
    };
  }

  async findOne(id: string, tenantId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id,
        class: { tenantId },
      },
      include: {
        class: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async cancel(id: string, userId: string, tenantId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id,
        class: { tenantId },
      },
      include: {
        class: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.ATTENDED) {
      throw new BadRequestException('Cannot cancel an attended booking');
    }

    const wasConfirmed = booking.status === BookingStatus.CONFIRMED;

    // Cancel the booking
    await this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });

    // If the cancelled booking was confirmed, promote the earliest waitlisted person
    if (wasConfirmed) {
      await this.prisma.class.update({
        where: { id: booking.classId },
        data: { currentCount: { decrement: 1 } },
      });

      // Find the earliest waitlisted booking for this class
      const nextWaitlisted = await this.prisma.booking.findFirst({
        where: {
          classId: booking.classId,
          status: BookingStatus.WAITLISTED,
        },
        orderBy: { bookedAt: 'asc' },
      });

      if (nextWaitlisted) {
        await this.prisma.booking.update({
          where: { id: nextWaitlisted.id },
          data: { status: BookingStatus.CONFIRMED },
        });
        await this.prisma.class.update({
          where: { id: booking.classId },
          data: { currentCount: { increment: 1 } },
        });
        this.logger.log(
          `Waitlisted user ${nextWaitlisted.userId} promoted for class ${booking.classId}`,
        );
      }
    }

    this.logger.log(`Booking cancelled: ${id}`);
    return { message: 'Booking cancelled successfully' };
  }

  async findAllForUser(
    userId: string,
    tenantId: string,
    status?: BookingStatus,
    page = 1,
    limit = 20,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
      class: { tenantId },
    };

    if (status) {
      where.status = status;
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { bookedAt: 'desc' },
        include: {
          class: {
            select: {
              id: true,
              name: true,
              type: true,
              startTime: true,
              endTime: true,
              location: true,
              maxCapacity: true,
              currentCount: true,
              trainer: {
                include: {
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async markAttended(id: string, tenantId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id,
        class: { tenantId },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed bookings can be marked as attended');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.ATTENDED },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    this.logger.log(`Booking attended: ${id}`);
    return updated;
  }
}
