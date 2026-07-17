import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: 'Class ID to book' })
  @IsString()
  classId: string;
}
