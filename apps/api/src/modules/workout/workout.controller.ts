import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { CreateSessionLogDto } from './dto/create-session-log.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  // ─── EXERCISES ───

  @Get('exercises')
  @ApiTags('Workouts')
  @ApiOperation({ summary: 'List exercise library' })
  findAllExercises(@Query('search') search?: string) {
    return this.workoutService.findAllExercises(search);
  }

  // ─── WORKOUTS ───

  @Get('workouts')
  @ApiTags('Workouts')
  @ApiOperation({ summary: 'List workout templates' })
  findAllWorkouts(
    @CurrentTenant() tenantId: string,
    @Query('trainerId') trainerId?: string,
  ) {
    return this.workoutService.findAllWorkouts(tenantId, trainerId);
  }

  @Get('workouts/:id')
  @ApiTags('Workouts')
  @ApiOperation({ summary: 'Get workout by ID' })
  findOneWorkout(@Param('id') id: string) {
    return this.workoutService.findOneWorkout(id);
  }

  @Post('workouts')
  @ApiTags('Workouts')
  @ApiOperation({ summary: 'Create workout template' })
  @Roles('TRAINER', 'GYM_OWNER', 'GYM_ADMIN')
  createWorkout(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateWorkoutDto,
  ) {
    return this.workoutService.createWorkout(tenantId, user.id, dto);
  }

  @Patch('workouts/:id')
  @ApiTags('Workouts')
  @ApiOperation({ summary: 'Update workout' })
  @Roles('TRAINER', 'GYM_OWNER', 'GYM_ADMIN')
  updateWorkout(@Param('id') id: string, @Body() dto: Partial<CreateWorkoutDto>) {
    return this.workoutService.updateWorkout(id, dto);
  }

  @Delete('workouts/:id')
  @ApiTags('Workouts')
  @ApiOperation({ summary: 'Delete workout' })
  @Roles('TRAINER', 'GYM_OWNER', 'GYM_ADMIN')
  deleteWorkout(@Param('id') id: string) {
    return this.workoutService.deleteWorkout(id);
  }

  // ─── WORKOUT SESSIONS ───

  @Post('workout-sessions')
  @ApiTags('Workout Sessions')
  @ApiOperation({ summary: 'Post a workout session' })
  @Roles('TRAINER', 'GYM_OWNER', 'GYM_ADMIN')
  createSession(@CurrentUser() user: any, @Body() dto: CreateSessionDto) {
    return this.workoutService.createSession(user.id, dto);
  }

  @Get('workout-sessions')
  @ApiTags('Workout Sessions')
  @ApiOperation({ summary: 'List workout sessions' })
  findAllSessions(
    @CurrentTenant() tenantId: string,
    @Query('visibility') visibility?: string,
  ) {
    return this.workoutService.findAllSessions(tenantId, visibility);
  }

  @Get('workout-sessions/:id')
  @ApiTags('Workout Sessions')
  @ApiOperation({ summary: 'Get session by ID' })
  findOneSession(@Param('id') id: string) {
    return this.workoutService.findOneSession(id);
  }

  @Post('workout-sessions/:id/logs')
  @ApiTags('Workout Sessions')
  @ApiOperation({ summary: 'Add exercise log to session' })
  addSessionLog(
    @Param('id') sessionId: string,
    @Body() dto: CreateSessionLogDto,
  ) {
    return this.workoutService.addSessionLog(sessionId, dto);
  }
}
