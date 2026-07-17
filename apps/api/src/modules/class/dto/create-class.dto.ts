import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClassType, Recurrence } from '@prisma/client';

export class CreateClassDto {
  @ApiProperty({ example: 'Morning Yoga Flow' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'A gentle yoga class for all levels' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ClassType, example: 'YOGA' })
  @IsEnum(ClassType)
  type: ClassType;

  @ApiProperty({ description: 'Trainer ID who will lead the class' })
  @IsString()
  trainerId: string;

  @ApiProperty({ example: '2024-08-15T07:00:00.000Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2024-08-15T08:00:00.000Z' })
  @IsDateString()
  endTime: string;

  @ApiPropertyOptional({ enum: Recurrence, example: 'WEEKLY' })
  @IsOptional()
  @IsEnum(Recurrence)
  recurrence?: Recurrence;

  @ApiProperty({ example: 20, description: 'Maximum number of participants' })
  @IsNumber()
  @Min(1)
  maxCapacity: number;

  @ApiPropertyOptional({ example: 'Studio A - 2nd Floor' })
  @IsOptional()
  @IsString()
  location?: string;
}
