import {
  Controller,
  Get,
  Post,
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
import { PaymentService } from './payment.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN, UserRole.MEMBER)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiOperation({ summary: 'Initiate a PayHere payment checkout' })
  @ApiResponse({ status: 201, description: 'Payment checkout data generated' })
  async initiate(
    @Body() dto: InitiatePaymentDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.paymentService.initiatePayment(dto, tenantId, userId);
  }

  @Post('webhook')
  @Public()
  @ApiOperation({ summary: 'PayHere webhook callback (notify_url)' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async webhook(@Body() body: Record<string, any>) {
    return this.paymentService.handleWebhook(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiOperation({ summary: 'List all payments for tenant' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated payment list' })
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @CurrentUser() _user?: any,
  ) {
    return this.paymentService.findAll(tenantId, page, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.GYM_ADMIN)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment details' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() _user: any,
  ) {
    return this.paymentService.findOne(id, tenantId);
  }
}
