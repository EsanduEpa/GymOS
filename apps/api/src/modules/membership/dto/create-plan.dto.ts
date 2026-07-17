import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DurationType } from '@prisma/client';

export class CreatePlanDto {
  @ApiProperty({ example: 'Premium Membership' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Access to all facilities including pool and sauna' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 5000, description: 'Price in LKR' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ default: 'LKR', example: 'LKR' })
  @IsOptional()
  @IsString()
  currency?: string = 'LKR';

  @ApiProperty({ example: 1, description: 'Duration value' })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ enum: DurationType, example: 'MONTHLY' })
  @IsEnum(DurationType)
  durationType: DurationType;

  @ApiPropertyOptional({
    type: [String],
    example: ['Gym Access', 'Pool Access', 'Locker'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ example: 100, description: 'Maximum number of members on this plan' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxMembers?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
