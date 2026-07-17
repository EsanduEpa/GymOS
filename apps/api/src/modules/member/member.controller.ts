import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
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
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { QueryMemberDto } from './dto/query-member.dto';
import { CreateBodyMetricDto } from './dto/create-body-metric.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@ApiTags('Members')
@Controller('members')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@ApiBearerAuth()
@ApiHeader({ name: 'x-tenant-id', required: true })
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiOperation({ summary: 'Create a new member with user account' })
  @ApiResponse({ status: 201, description: 'Member created successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(
    @Body() dto: CreateMemberDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.memberService.create(dto, tenantId);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN, UserRole.TRAINER)
  @ApiOperation({ summary: 'List members with search, pagination, and status filter' })
  @ApiResponse({ status: 200, description: 'Paginated member list' })
  async findAll(
    @Query() query: QueryMemberDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.memberService.findAll(tenantId, query);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN, UserRole.TRAINER)
  @ApiOperation({ summary: 'Get member by ID with relations' })
  @ApiResponse({ status: 200, description: 'Member details' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.memberService.findOne(id, tenantId);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiOperation({ summary: 'Update member details' })
  @ApiResponse({ status: 200, description: 'Member updated' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMemberDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.memberService.update(id, tenantId, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiOperation({ summary: 'Soft delete (deactivate) member' })
  @ApiResponse({ status: 200, description: 'Member deactivated' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async remove(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.memberService.remove(id, tenantId);
  }

  @Get(':id/metrics')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN, UserRole.TRAINER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Get body metrics history for a member' })
  @ApiResponse({ status: 200, description: 'Body metrics list' })
  async getMetrics(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.memberService.getBodyMetrics(id, tenantId);
  }

  @Post(':id/metrics')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN, UserRole.TRAINER, UserRole.MEMBER)
  @ApiOperation({ summary: 'Add body metric record for a member' })
  @ApiResponse({ status: 201, description: 'Body metric recorded' })
  async addMetric(
    @Param('id') id: string,
    @Body() dto: CreateBodyMetricDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.memberService.addBodyMetric(id, tenantId, dto);
  }
}
