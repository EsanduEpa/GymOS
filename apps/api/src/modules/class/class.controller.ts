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
  ApiQuery,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@ApiTags('Classes')
@Controller('classes')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@ApiBearerAuth()
@ApiHeader({ name: 'x-tenant-id', required: true })
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN, UserRole.TRAINER)
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: 201, description: 'Class created' })
  async create(
    @Body() dto: CreateClassDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.classService.create(dto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'List classes for tenant with optional date range filter' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'ISO date string' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'ISO date string' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated class list' })
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @CurrentUser() _user?: any,
  ) {
    return this.classService.findAll(tenantId, startDate, endDate, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get class by ID with bookings and trainer info' })
  @ApiResponse({ status: 200, description: 'Class details' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.classService.findOne(id, tenantId);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN, UserRole.TRAINER)
  @ApiOperation({ summary: 'Update a class' })
  @ApiResponse({ status: 200, description: 'Class updated' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClassDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.classService.update(id, tenantId, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiOperation({ summary: 'Deactivate a class' })
  @ApiResponse({ status: 200, description: 'Class deactivated' })
  async remove(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.classService.remove(id, tenantId);
  }
}
