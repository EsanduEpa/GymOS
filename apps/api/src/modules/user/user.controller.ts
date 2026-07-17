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
  ApiHeader,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(TenantGuard, RolesGuard)
@ApiBearerAuth()
@ApiHeader({ name: 'x-tenant-id', required: true })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiOperation({ summary: 'Create a new user within tenant' })
  @ApiResponse({ status: 201, description: 'User created' })
  async create(
    @Body() dto: CreateUserDto,
    @CurrentTenant() tenantId: string,
  ) {
    return this.userService.create(dto, tenantId);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiOperation({ summary: 'List users in tenant' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('role') role?: UserRole,
  ) {
    return this.userService.findAll(tenantId, page, limit, role);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
  ) {
    return this.userService.findOne(id, tenantId);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiOperation({ summary: 'Update user' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentTenant() tenantId: string,
  ) {
    return this.userService.update(id, tenantId, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER)
  @ApiOperation({ summary: 'Deactivate user' })
  async remove(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
  ) {
    return this.userService.remove(id, tenantId);
  }
}
