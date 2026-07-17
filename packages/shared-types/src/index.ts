// ─── Enums ───

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  GYM_OWNER = 'GYM_OWNER',
  GYM_ADMIN = 'GYM_ADMIN',
  TRAINER = 'TRAINER',
  MEMBER = 'MEMBER',
}

export enum TenantPlan {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export enum DurationType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum ClassType {
  YOGA = 'YOGA',
  HIIT = 'HIIT',
  CROSSFIT = 'CROSSFIT',
  ZUMBA = 'ZUMBA',
  PILATES = 'PILATES',
  SPINNING = 'SPINNING',
  BOXING = 'BOXING',
  STRENGTH = 'STRENGTH',
  CARDIO = 'CARDIO',
  FLEXIBILITY = 'FLEXIBILITY',
  CUSTOM = 'CUSTOM',
}

export enum Recurrence {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  WAITLISTED = 'WAITLISTED',
  CANCELLED = 'CANCELLED',
  ATTENDED = 'ATTENDED',
  NO_SHOW = 'NO_SHOW',
}

export enum WorkoutVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

// ─── Interfaces ───

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  primaryColor: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  plan: TenantPlan;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  tenantId: string | null;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatar: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tenant?: Tenant;
  memberProfile?: Member;
  trainerProfile?: Trainer;
}

export interface Member {
  id: string;
  userId: string;
  dateOfBirth: string | null;
  gender: Gender | null;
  emergencyContact: string | null;
  healthNotes: string | null;
  height: number | null;
  weight: number | null;
  bodyFat: number | null;
  joinDate: string;
  user?: User;
  subscription?: Subscription;
}

export interface Trainer {
  id: string;
  userId: string;
  specializations: string[];
  bio: string | null;
  certifications: string[];
  rating: number | null;
  user?: User;
}

export interface MembershipPlan {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  duration: number;
  durationType: DurationType;
  features: string[];
  maxMembers: number | null;
  isActive: boolean;
  createdAt: string;
  _count?: { subscriptions: number };
}

export interface Subscription {
  id: string;
  memberId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  autoRenew: boolean;
  plan?: MembershipPlan;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string | null;
  payhereOrderId: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface Class {
  id: string;
  tenantId: string;
  trainerId: string;
  name: string;
  description: string | null;
  type: ClassType;
  startTime: string;
  endTime: string;
  recurrence: Recurrence | null;
  maxCapacity: number;
  currentCount: number;
  location: string | null;
  isActive: boolean;
  trainer?: Trainer;
  bookings?: Booking[];
}

export interface Booking {
  id: string;
  userId: string;
  classId: string;
  status: BookingStatus;
  bookedAt: string;
  cancelledAt: string | null;
  user?: User;
  class?: Class;
}

export interface Exercise {
  id: string;
  name: string;
  description: string | null;
  muscleGroup: string;
  secondaryMuscles: string[];
  equipment: string | null;
  videoUrl: string | null;
  imageUrl: string | null;
  instructions: string[];
}

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  order: number;
  sets: number;
  reps: string | null;
  weight: string | null;
  restSeconds: number | null;
  notes: string | null;
  exercise?: Exercise;
}

export interface Workout {
  id: string;
  tenantId: string;
  trainerId: string;
  title: string;
  description: string | null;
  visibility: WorkoutVisibility;
  difficulty: Difficulty;
  duration: number;
  targetMuscles: string[];
  createdAt: string;
  updatedAt: string;
  exercises?: WorkoutExercise[];
  trainer?: Trainer;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  trainerId: string;
  title: string;
  notes: string | null;
  visibility: WorkoutVisibility;
  photos: string[];
  completedAt: string | null;
  postedAt: string;
  workout?: Workout;
  sessionLogs?: SessionLog[];
}

export interface SessionLog {
  id: string;
  sessionId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number | null;
  duration: number | null;
  notes: string | null;
}

export interface BodyMetric {
  id: string;
  memberId: string;
  weight: number | null;
  bodyFat: number | null;
  muscleMass: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  arms: number | null;
  thighs: number | null;
  recordedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

// ─── API Response Types ───

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface DashboardStats {
  totalMembers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  classesToday: number;
  memberGrowth: number; // percentage
  revenueGrowth: number; // percentage
}
