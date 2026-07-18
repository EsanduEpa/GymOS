import { IsString, IsOptional, IsEnum, IsInt, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class WorkoutExerciseDto {
  @ApiProperty() @IsString() exerciseId: string;
  @ApiProperty() @IsInt() order: number;
  @ApiProperty() @IsInt() sets: number;
  @ApiPropertyOptional() @IsOptional() @IsString() reps?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() weight?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() restSeconds?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class CreateWorkoutDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty({ enum: ['PUBLIC', 'PRIVATE'] })
  @IsEnum(['PUBLIC', 'PRIVATE'])
  visibility: string;
  @ApiProperty({ enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] })
  @IsEnum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'])
  difficulty: string;
  @ApiProperty() @IsInt() duration: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true })
  targetMuscles?: string[];
  @ApiPropertyOptional({ type: [WorkoutExerciseDto] })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => WorkoutExerciseDto)
  exercises?: WorkoutExerciseDto[];
}
