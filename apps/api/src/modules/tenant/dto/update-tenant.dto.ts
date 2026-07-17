import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { TenantPlan } from '@prisma/client';

export class UpdateTenantDto {
  @ApiProperty({ example: 'Iron Gym Colombo', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'iron-gym-colombo', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ enum: TenantPlan, required: false })
  @IsEnum(TenantPlan)
  @IsOptional()
  plan?: TenantPlan;
}
