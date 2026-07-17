import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { DurationType, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class MembershipService {
  private readonly logger = new Logger(MembershipService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ── Membership Plans ──────────────────────────────────────────────

  async createPlan(dto: CreatePlanDto, tenantId: string) {
    const plan = await this.prisma.membershipPlan.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        currency: dto.currency || 'LKR',
        duration: dto.duration,
        durationType: dto.durationType,
        features: dto.features || [],
        maxMembers: dto.maxMembers,
        isActive: dto.isActive ?? true,
      },
    });

    this.logger.log(`Plan created: ${plan.name} for tenant ${tenantId}`);
    return plan;
  }

  async findAllPlans(tenantId: string) {
    return this.prisma.membershipPlan.findMany({
      where: { tenantId, isActive: true },
      orderBy: { price: 'asc' },
      include: {
        _count: {
          select: { subscriptions: true },
        },
      },
    });
  }

  async findPlanById(id: string, tenantId: string) {
    const plan = await this.prisma.membershipPlan.findFirst({
      where: { id, tenantId },
      include: {
        _count: {
          select: { subscriptions: true },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException('Membership plan not found');
    }

    return plan;
  }

  async updatePlan(id: string, tenantId: string, dto: UpdatePlanDto) {
    await this.findPlanById(id, tenantId);

    const plan = await this.prisma.membershipPlan.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.currency !== undefined ? { currency: dto.currency } : {}),
        ...(dto.duration !== undefined ? { duration: dto.duration } : {}),
        ...(dto.durationType !== undefined ? { durationType: dto.durationType } : {}),
        ...(dto.features !== undefined ? { features: dto.features } : {}),
        ...(dto.maxMembers !== undefined ? { maxMembers: dto.maxMembers } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
    });

    this.logger.log(`Plan updated: ${id}`);
    return plan;
  }

  async deactivatePlan(id: string, tenantId: string) {
    await this.findPlanById(id, tenantId);

    await this.prisma.membershipPlan.update({
      where: { id },
      data: { isActive: false },
    });

    this.logger.log(`Plan deactivated: ${id}`);
    return { message: 'Membership plan deactivated successfully' };
  }

  // ── Subscriptions ─────────────────────────────────────────────────

  async createSubscription(dto: CreateSubscriptionDto, tenantId: string) {
    // Verify the plan belongs to this tenant
    const plan = await this.prisma.membershipPlan.findFirst({
      where: { id: dto.planId, tenantId, isActive: true },
    });

    if (!plan) {
      throw new NotFoundException('Membership plan not found or inactive');
    }

    // Verify the member exists and belongs to this tenant
    const member = await this.prisma.member.findFirst({
      where: {
        id: dto.memberId,
        user: { tenantId },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found in this gym');
    }

    // Check if member already has an active subscription
    const existingSub = await this.prisma.subscription.findFirst({
      where: {
        memberId: dto.memberId,
        status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.PAUSED] },
      },
    });

    if (existingSub) {
      throw new ConflictException('Member already has an active or paused subscription');
    }

    // Check max members capacity
    if (plan.maxMembers) {
      const activeCount = await this.prisma.subscription.count({
        where: {
          planId: plan.id,
          status: SubscriptionStatus.ACTIVE,
        },
      });
      if (activeCount >= plan.maxMembers) {
        throw new BadRequestException('This plan has reached its maximum member capacity');
      }
    }

    // Calculate end date based on plan duration
    const startDate = dto.startDate ? new Date(dto.startDate) : new Date();
    const endDate = this.calculateEndDate(startDate, plan.duration, plan.durationType);

    const subscription = await this.prisma.subscription.create({
      data: {
        memberId: dto.memberId,
        planId: dto.planId,
        startDate,
        endDate,
        autoRenew: dto.autoRenew || false,
        status: SubscriptionStatus.ACTIVE,
      },
      include: {
        plan: true,
        member: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    this.logger.log(`Subscription created for member ${dto.memberId} on plan ${plan.name}`);
    return subscription;
  }

  async findSubscriptionById(id: string, tenantId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        id,
        plan: { tenantId },
      },
      include: {
        plan: true,
        member: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  async pauseSubscription(id: string, tenantId: string) {
    const subscription = await this.findSubscriptionById(id, tenantId);

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('Only active subscriptions can be paused');
    }

    const updated = await this.prisma.subscription.update({
      where: { id },
      data: { status: SubscriptionStatus.PAUSED },
      include: { plan: true },
    });

    this.logger.log(`Subscription paused: ${id}`);
    return updated;
  }

  async cancelSubscription(id: string, tenantId: string) {
    const subscription = await this.findSubscriptionById(id, tenantId);

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new BadRequestException('Subscription is already cancelled');
    }

    const updated = await this.prisma.subscription.update({
      where: { id },
      data: { status: SubscriptionStatus.CANCELLED },
      include: { plan: true },
    });

    this.logger.log(`Subscription cancelled: ${id}`);
    return updated;
  }

  async resumeSubscription(id: string, tenantId: string) {
    const subscription = await this.findSubscriptionById(id, tenantId);

    if (subscription.status !== SubscriptionStatus.PAUSED) {
      throw new BadRequestException('Only paused subscriptions can be resumed');
    }

    const updated = await this.prisma.subscription.update({
      where: { id },
      data: { status: SubscriptionStatus.ACTIVE },
      include: { plan: true },
    });

    this.logger.log(`Subscription resumed: ${id}`);
    return updated;
  }

  // ── Helpers ───────────────────────────────────────────────────────

  private calculateEndDate(
    startDate: Date,
    duration: number,
    durationType: DurationType,
  ): Date {
    const endDate = new Date(startDate);

    switch (durationType) {
      case DurationType.DAILY:
        endDate.setDate(endDate.getDate() + duration);
        break;
      case DurationType.WEEKLY:
        endDate.setDate(endDate.getDate() + duration * 7);
        break;
      case DurationType.MONTHLY:
        endDate.setMonth(endDate.getMonth() + duration);
        break;
      case DurationType.QUARTERLY:
        endDate.setMonth(endDate.getMonth() + duration * 3);
        break;
      case DurationType.YEARLY:
        endDate.setFullYear(endDate.getFullYear() + duration);
        break;
    }

    return endDate;
  }
}
