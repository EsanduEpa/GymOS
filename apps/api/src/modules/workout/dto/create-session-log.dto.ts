import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSessionLogDto {
  @ApiProperty() @IsString() exerciseName: string;
  @ApiProperty() @IsInt() sets: number;
  @ApiProperty() @IsInt() reps: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() weight?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() duration?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
