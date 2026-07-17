import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class CreateMemberDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'P@ssw0rd123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: '+94771234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '1995-06-15' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: Gender, example: 'MALE' })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ example: '+94771234568 (Jane Doe - Spouse)' })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiPropertyOptional({ example: 'No known allergies' })
  @IsOptional()
  @IsString()
  healthNotes?: string;

  @ApiPropertyOptional({ example: 175, description: 'Height in cm' })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({ example: 70, description: 'Weight in kg' })
  @IsOptional()
  @IsNumber()
  weight?: number;
}
