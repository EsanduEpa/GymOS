import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty() @IsString() workoutId: string;
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiProperty({ enum: ['PUBLIC', 'PRIVATE'] })
  @IsEnum(['PUBLIC', 'PRIVATE'])
  visibility: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true })
  photos?: string[];
}
