import { IsOptional, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBodyMetricDto {
  @ApiPropertyOptional({ example: 70.5, description: 'Weight in kg' })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ example: 15.2, description: 'Body fat percentage' })
  @IsOptional()
  @IsNumber()
  bodyFat?: number;

  @ApiPropertyOptional({ example: 32.5, description: 'Muscle mass in kg' })
  @IsOptional()
  @IsNumber()
  muscleMass?: number;

  @ApiPropertyOptional({ example: 95.0, description: 'Chest measurement in cm' })
  @IsOptional()
  @IsNumber()
  chest?: number;

  @ApiPropertyOptional({ example: 80.0, description: 'Waist measurement in cm' })
  @IsOptional()
  @IsNumber()
  waist?: number;

  @ApiPropertyOptional({ example: 95.0, description: 'Hips measurement in cm' })
  @IsOptional()
  @IsNumber()
  hips?: number;

  @ApiPropertyOptional({ example: 35.0, description: 'Arms measurement in cm' })
  @IsOptional()
  @IsNumber()
  arms?: number;

  @ApiPropertyOptional({ example: 55.0, description: 'Thighs measurement in cm' })
  @IsOptional()
  @IsNumber()
  thighs?: number;
}
