import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'Member ID to create subscription for' })
  @IsString()
  memberId: string;

  @ApiProperty({ description: 'Membership plan ID' })
  @IsString()
  planId: string;

  @ApiPropertyOptional({ example: '2024-01-15', description: 'Subscription start date (defaults to now)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;
}
