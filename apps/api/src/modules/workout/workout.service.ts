import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { CreateSessionLogDto } from './dto/create-session-log.dto';

@Injectable()
export class WorkoutService {
  constructor(private prisma: PrismaService) {}

  // ─── EXERCISES ───

  async findAllExercises(search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { muscleGroup: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};
    return this.prisma.exercise.findMany({ where, orderBy: { muscleGroup: 'asc' } });
  }

  // ─── WORKOUTS ───

  async createWorkout(tenantId: string, trainerId: string, dto: CreateWorkoutDto) {
    const { exercises, ...workoutData } = dto;
    return this.prisma.workout.create({
      data: {
        ...workoutData,
        tenantId,
        trainerId,
        visibility: dto.visibility as any,
        difficulty: dto.difficulty as any,
        exercises: exercises?.length
          ? {
              create: exercises.map((ex) => ({
                exerciseId: ex.exerciseId,
                order: ex.order,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight,
                restSeconds: ex.restSeconds,
                notes: ex.notes,
              })),
            }
          : undefined,
      },
      include: {
        exercises: { include: { exercise: true }, orderBy: { order: 'asc' } },
        trainer: { include: { user: true } },
      },
    });
  }

  async findAllWorkouts(tenantId: string, trainerId?: string) {
    return this.prisma.workout.findMany({
      where: { tenantId, ...(trainerId ? { trainerId } : {}) },
      include: {
        exercises: { include: { exercise: true }, orderBy: { order: 'asc' } },
        trainer: { include: { user: { select: { firstName: true, lastName: true } } } },
        _count: { select: { sessions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneWorkout(id: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
      include: {
        exercises: { include: { exercise: true }, orderBy: { order: 'asc' } },
        trainer: { include: { user: { select: { firstName: true, lastName: true, avatar: true } } } },
        sessions: { take: 5, orderBy: { postedAt: 'desc' } },
      },
    });
    if (!workout) throw new NotFoundException('Workout not found');
    return workout;
  }

  async updateWorkout(id: string, dto: Partial<CreateWorkoutDto>) {
    const { exercises, ...data } = dto;
    if (exercises) {
      await this.prisma.workoutExercise.deleteMany({ where: { workoutId: id } });
      await this.prisma.workoutExercise.createMany({
        data: exercises.map((ex) => ({ workoutId: id, ...ex })),
      });
    }
    return this.prisma.workout.update({
      where: { id },
      data: { ...data, visibility: data.visibility as any, difficulty: data.difficulty as any },
      include: { exercises: { include: { exercise: true }, orderBy: { order: 'asc' } } },
    });
  }

  async deleteWorkout(id: string) {
    return this.prisma.workout.delete({ where: { id } });
  }

  // ─── WORKOUT SESSIONS ───

  async createSession(trainerId: string, dto: CreateSessionDto) {
    return this.prisma.workoutSession.create({
      data: {
        workoutId: dto.workoutId,
        trainerId,
        title: dto.title,
        notes: dto.notes,
        visibility: dto.visibility as any,
        photos: dto.photos || [],
        completedAt: new Date(),
      },
      include: {
        workout: true,
        user: { select: { firstName: true, lastName: true, avatar: true } },
      },
    });
  }

  async findAllSessions(tenantId: string, visibility?: string) {
    const where: any = {
      workout: { tenantId },
    };
    if (visibility) {
      where.visibility = visibility;
    }
    return this.prisma.workoutSession.findMany({
      where,
      include: {
        workout: { select: { title: true, difficulty: true, targetMuscles: true } },
        user: { select: { firstName: true, lastName: true, avatar: true } },
        _count: { select: { sessionLogs: true } },
      },
      orderBy: { postedAt: 'desc' },
    });
  }

  async findOneSession(id: string) {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id },
      include: {
        workout: { include: { exercises: { include: { exercise: true } } } },
        user: { select: { firstName: true, lastName: true, avatar: true } },
        sessionLogs: true,
      },
    });
    if (!session) throw new NotFoundException('Workout session not found');
    return session;
  }

  // ─── SESSION LOGS ───

  async addSessionLog(sessionId: string, dto: CreateSessionLogDto) {
    return this.prisma.sessionLog.create({
      data: { sessionId, ...dto },
    });
  }
}
