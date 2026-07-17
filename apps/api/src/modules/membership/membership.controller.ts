import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { MembershipService } from './membership.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@ApiTags('Membership')
@Controller()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@ApiBearerAuth()
@ApiHeader({ name: 'x-tenant-id', required: true })
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  // ── Membership Plans ──────────────────────────────────────────────

  @Post('membership-plans')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiOperation({ summary: 'Create a membership plan' })
  @ApiResponse({ status: 201, description: 'Plan created' })
  async createPlan(
    @Body() dto: CreatePlanDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.membershipService.createPlan(dto, tenantId);
  }

  @Get('membership-plans')
  @ApiOperation({ summary: 'List all active membership plans for tenant' })
  @ApiResponse({ status: 200, description: 'Plan list' })
  async findAllPlans(
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.membershipService.findAllPlans(tenantId);
  }

  @Get('membership-plans/:id')
  @ApiOperation({ summary: 'Get membership plan by ID' })
  @ApiResponse({ status: 200, description: 'Plan details' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async findPlanById(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.membershipService.findPlanById(id, tenantId);
  }

  @Patch('membership-plans/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiOperation({ summary: 'Update a membership plan' })
  @ApiResponse({ status: 200, description: 'Plan updated' })
  async updatePlan(
    @Param('id') id: string,
    @Body() dto: UpdatePlanDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.membershipService.updatePlan(id, tenantId, dto);
  }

  @Delete('membership-plans/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiOperation({ summary: 'Deactivate a membership plan' })
  @ApiResponse({ status: 200, description: 'Plan deactivated' })
  async deactivatePlan(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.membershipService.deactivatePlan(id, tenantId);
  }

  // ── Subscriptions ─────────────────────────────────────────────────

  @Post('subscriptions')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiOperation({ summary: 'Create a subscription for a member' })
  @ApiResponse({ status: 201, description: 'Subscription created' })
  @ApiResponse({ status: 409, description: 'Member already has active subscription' })
  async createSubscription(
    @Body() dto: CreateSubscriptionDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.membershipService.createSubscription(dto, tenantId);
  }

  @Get('subscriptions/:id')
  @ApiOperation({ summary: 'Get subscription by ID' })
  @ApiResponse({ status: 200, description: 'Subscription details' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async findSubscription(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.membershipService.findSubscriptionById(id, tenantId);
  }

  @Patch('subscriptions/:id/pause')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiOperation({ summary: 'Pause an active subscription' })
  @ApiResponse({ status: 200, description: 'Subscription paused' })
  async pauseSubscription(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.membershipService.pauseSubscription(id, tenantId);
  }

  @Patch('subscriptions/:id/cancel')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiOperation({ summary: 'Cancel a subscription' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled' })
  async cancelSubscription(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.membershipService.cancelSubscription(id, tenantId);
  }

  @Patch('subscriptions/:id/resume')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiOperation({ summary: 'Resume a paused subscription' })
  @ApiResponse({ status: 200, description: 'Subscription resumed' })
  async resumeSubscription(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.membershipService.resumeSubscription(id, tenantId);
  }
}
