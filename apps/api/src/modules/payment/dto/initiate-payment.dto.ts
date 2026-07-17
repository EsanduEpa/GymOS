import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InitiatePaymentDto {
  @ApiProperty({ description: 'Subscription ID to pay for' })
  @IsString()
  subscriptionId: string;

  @ApiProperty({ example: 5000, description: 'Payment amount in LKR' })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiPropertyOptional({ default: 'LKR', example: 'LKR' })
  @IsOptional()
  @IsString()
  currency?: string = 'LKR';
}
