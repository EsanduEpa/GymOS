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
  ApiQuery,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new tenant (gym)' })
  @ApiResponse({ status: 201, description: 'Tenant created' })
  async create(@Body() dto: CreateTenantDto) {
    return this.tenantService.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all tenants' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.tenantService.findAll(page, limit);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get tenant by slug (public)' })
  @ApiResponse({ status: 200, description: 'Tenant details' })
  async findBySlug(@Param('slug') slug: string) {
    return this.tenantService.findBySlug(slug);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tenant by ID' })
  @ApiResponse({ status: 200, description: 'Tenant details' })
  async findOne(@Param('id') id: string) {
    return this.tenantService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tenant' })
  async update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.tenantService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate tenant' })
  async remove(@Param('id') id: string) {
    return this.tenantService.remove(id);
  }
}
