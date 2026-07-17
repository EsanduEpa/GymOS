// ── User & Auth ──────────────────────────────────────────────────────────────

export type UserRole = "SUPER_ADMIN" | "GYM_OWNER" | "GYM_ADMIN" | "TRAINER" | "MEMBER";
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  tenantId?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Tenant ───────────────────────────────────────────────────────────────────

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  primaryColor?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  plan: "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  isActive: boolean;
  memberCount?: number;
  trainerCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ── Member ───────────────────────────────────────────────────────────────────

export interface Member {
  id: string;
  userId: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  joinDate: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "EXPIRED";
  notes?: string;
  subscription?: Subscription;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

// ── Trainer ──────────────────────────────────────────────────────────────────

export interface Trainer {
  id: string;
  userId: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  specializations: string[];
  certifications: string[];
  rating?: number;
  classCount?: number;
  status: "ACTIVE" | "INACTIVE";
  user?: User;
  createdAt: string;
  updatedAt: string;
}

// ── Membership Plan ──────────────────────────────────────────────────────────

export interface MembershipPlan {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  duration: number;
  durationType: "DAYS" | "WEEKS" | "MONTHS" | "YEARS";
  features: string[];
  maxMembers?: number;
  memberCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Subscription ─────────────────────────────────────────────────────────────

export interface Subscription {
  id: string;
  memberId: string;
  planId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PAUSED";
  autoRenew: boolean;
  plan?: MembershipPlan;
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

// ── Payment ──────────────────────────────────────────────────────────────────

export interface Payment {
  id: string;
  subscriptionId: string;
  memberId: string;
  tenantId: string;
  amount: number;
  currency: string;
  method: "CASH" | "CARD" | "BANK_TRANSFER" | "ONLINE";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  reference?: string;
  notes?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Class ────────────────────────────────────────────────────────────────────

export interface Class {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  trainerId: string;
  trainerName?: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  maxCapacity: number;
  currentBookings?: number;
  room?: string;
  color?: string;
  isRecurring: boolean;
  isActive: boolean;
  trainer?: Trainer;
  bookings?: Booking[];
  createdAt: string;
  updatedAt: string;
}

// ── Booking ──────────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  classId: string;
  memberId: string;
  tenantId: string;
  date: string;
  status: "CONFIRMED" | "CANCELLED" | "ATTENDED" | "NO_SHOW";
  class?: Class;
  member?: Member;
  createdAt: string;
  updatedAt: string;
}

// ── Workout ──────────────────────────────────────────────────────────────────

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  category: string;
  muscleGroup: string;
  equipment?: string;
  videoUrl?: string;
  imageUrl?: string;
  instructions?: string;
}

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  order: number;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  notes?: string;
  exercise?: Exercise;
}

export interface Workout {
  id: string;
  tenantId: string;
  trainerId: string;
  title: string;
  description?: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  visibility: "PUBLIC" | "PRIVATE" | "MEMBERS_ONLY";
  estimatedDuration?: number;
  exercises: WorkoutExercise[];
  trainer?: Trainer;
  createdAt: string;
  updatedAt: string;
}

// ── Workout Session ──────────────────────────────────────────────────────────

export interface SessionLog {
  id: string;
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  reps?: number;
  weight?: number;
  duration?: number;
  notes?: string;
  exercise?: Exercise;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  trainerId: string;
  tenantId: string;
  title: string;
  notes?: string;
  photos?: string[];
  visibility: "PUBLIC" | "PRIVATE" | "MEMBERS_ONLY";
  workout?: Workout;
  trainer?: Trainer;
  logs?: SessionLog[];
  createdAt: string;
  updatedAt: string;
}

// ── Body Metrics ─────────────────────────────────────────────────────────────

export interface BodyMetric {
  id: string;
  memberId: string;
  tenantId: string;
  date: string;
  weight?: number;
  height?: number;
  bodyFat?: number;
  muscleMass?: number;
  bmi?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  tenantId?: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// ── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalMembers: number;
  activeSubscriptions: number;
  revenueThisMonth: number;
  classesToday: number;
  memberGrowth: number;
  revenueGrowth: number;
  subscriptionGrowth: number;
}

export interface AdminDashboardStats {
  totalGyms: number;
  totalUsers: number;
  totalRevenue: number;
  systemHealth: number;
  gymGrowth: number;
  userGrowth: number;
  revenueGrowth: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  previousValue?: number;
}

export interface ActivityItem {
  id: string;
  type: "member_joined" | "payment_received" | "class_booked" | "workout_posted" | "subscription_expired";
  title: string;
  description: string;
  timestamp: string;
  avatar?: string;
  link?: string;
}
