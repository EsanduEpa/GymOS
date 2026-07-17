import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    // Step 1: Personal Info
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase, one lowercase, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),

    // Step 2: Gym Details
    gymName: z
      .string()
      .min(1, "Gym name is required")
      .min(2, "Gym name must be at least 2 characters"),
    gymSlug: z
      .string()
      .min(1, "URL slug is required")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens"
      ),
    gymAddress: z.string().min(1, "Address is required"),
    gymPhone: z.string().optional(),
    gymEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),

    // Step 3: Plan selection
    plan: z.enum(["FREE", "STARTER", "PROFESSIONAL", "ENTERPRISE"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const createMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  planId: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateMemberFormValues = z.infer<typeof createMemberSchema>;

export const createPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  currency: z.string().default("LKR"),
  duration: z.coerce
    .number()
    .min(1, "Duration must be at least 1 day")
    .max(365, "Duration cannot exceed 365 days"),
  durationType: z.enum(["DAYS", "WEEKS", "MONTHS", "YEARS"]),
  features: z.array(z.string()).optional().default([]),
  maxMembers: z.coerce.number().optional(),
  isActive: z.boolean().default(true),
});

export type CreatePlanFormValues = z.infer<typeof createPlanSchema>;

export const createClassSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  description: z.string().optional(),
  trainerId: z.string().min(1, "Trainer is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  dayOfWeek: z.coerce.number().min(0).max(6),
  maxCapacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  room: z.string().optional(),
  color: z.string().optional().default("#6366f1"),
  isRecurring: z.boolean().default(true),
});

export type CreateClassFormValues = z.infer<typeof createClassSchema>;

export const createWorkoutSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
  visibility: z.enum(["PUBLIC", "PRIVATE", "MEMBERS_ONLY"]).default("PUBLIC"),
  estimatedDuration: z.coerce.number().optional(),
  exercises: z
    .array(
      z.object({
        exerciseId: z.string().min(1, "Exercise is required"),
        order: z.coerce.number(),
        sets: z.coerce.number().min(1).optional(),
        reps: z.coerce.number().min(1).optional(),
        weight: z.coerce.number().optional(),
        duration: z.coerce.number().optional(),
        restTime: z.coerce.number().optional(),
        notes: z.string().optional(),
      })
    )
    .min(1, "At least one exercise is required"),
});

export type CreateWorkoutFormValues = z.infer<typeof createWorkoutSchema>;

export const bodyMetricSchema = z.object({
  weight: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  bodyFat: z.coerce.number().optional(),
  muscleMass: z.coerce.number().optional(),
  bmi: z.coerce.number().optional(),
  chest: z.coerce.number().optional(),
  waist: z.coerce.number().optional(),
  hips: z.coerce.number().optional(),
  arms: z.coerce.number().optional(),
  thighs: z.coerce.number().optional(),
  notes: z.string().optional(),
});

export type BodyMetricFormValues = z.infer<typeof bodyMetricSchema>;
