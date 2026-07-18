import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { BookingStatus } from '@prisma/client';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Book a class' })
  @Roles('MEMBER', 'GYM_OWNER', 'GYM_ADMIN')
  create(
    @CurrentUser() user: any,
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingService.create(dto, user.id, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'List user bookings' })
  findAll(
    @CurrentUser() user: any,
    @CurrentTenant() tenantId: string,
    @Query('status') status?: BookingStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bookingService.findAllForUser(user.id, tenantId, status, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  findOne(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
  ) {
    return this.bookingService.findOne(id, tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a booking' })
  cancel(
    @CurrentUser() user: any,
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.bookingService.cancel(id, user.id, tenantId);
  }

  @Patch(':id/attend')
  @ApiOperation({ summary: 'Mark booking as attended (Trainer only)' })
  @Roles('TRAINER', 'GYM_OWNER', 'GYM_ADMIN')
  markAttended(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
  ) {
    return this.bookingService.markAttended(id, tenantId);
  }
}
