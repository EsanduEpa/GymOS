import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { TenantPlan } from '@prisma/client';

export class CreateTenantDto {
  @ApiProperty({ example: 'Iron Gym Colombo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'iron-gym-colombo' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @ApiProperty({ example: 'https://example.com/logo.png', required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ example: '#6366f1', required: false })
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @ApiProperty({ example: '123 Main St, Colombo', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '+94112345678', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'info@irongym.lk', required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ enum: TenantPlan, example: TenantPlan.FREE, required: false })
  @IsEnum(TenantPlan)
  @IsOptional()
  plan?: TenantPlan;
}
