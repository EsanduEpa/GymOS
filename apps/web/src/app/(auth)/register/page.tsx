'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Zap,
  Crown,
} from 'lucide-react';
import { registerSchema, type RegisterFormValues } from '@/lib/validators';
import { apiPost } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { slugify } from '@/lib/utils';
import type { ApiResponse, User as UserType } from '@/types';

const steps = ['Personal Info', 'Gym Details', 'Select Plan'];

const plans = [
  {
    id: 'FREE' as const,
    name: 'Free',
    price: 0,
    period: 'forever',
    icon: Sparkles,
    description: 'Get started with basic features',
    features: [
      'Up to 25 members',
      'Basic class scheduling',
      'Member check-in',
      'Email support',
    ],
    popular: false,
  },
  {
    id: 'STARTER' as const,
    name: 'Starter',
    price: 4900,
    period: '/month',
    icon: Zap,
    description: 'Perfect for growing gyms',
    features: [
      'Up to 100 members',
      'Advanced scheduling',
      'Workout templates',
      'Payment tracking',
      'Basic analytics',
      'Priority support',
    ],
    popular: true,
  },
  {
    id: 'PROFESSIONAL' as const,
    name: 'Professional',
    price: 12900,
    period: '/month',
    icon: Crown,
    description: 'For established fitness centers',
    features: [
      'Unlimited members',
      'Full analytics suite',
      'Custom branding',
      'API access',
      'Multi-location',
      'Dedicated support',
      'Advanced reporting',
    ],
    popular: false,
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      gymName: '',
      gymSlug: '',
      gymAddress: '',
      gymPhone: '',
      gymEmail: '',
      plan: 'FREE',
    },
  });

  const selectedPlan = watch('plan');

  const handleNext = async () => {
    let fieldsToValidate: (keyof RegisterFormValues)[] = [];
    if (currentStep === 0) {
      fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'];
    } else if (currentStep === 1) {
      fieldsToValidate = ['gymName', 'gymSlug', 'gymAddress'];
    }
    const valid = await trigger(fieldsToValidate);
    if (valid) setCurrentStep((s) => Math.min(2, s + 1));
  };

  const handleBack = () => setCurrentStep((s) => Math.max(0, s - 1));

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiPost<ApiResponse<{ user: UserType; accessToken: string; refreshToken: string }>>(
        '/api/auth/register',
        data
      );
      const result = response as unknown as { data: { user: UserType; accessToken: string; refreshToken: string } };
      login(result.data.user, result.data.accessToken, result.data.refreshToken);
      toast({ title: 'Account created!', description: 'Welcome to GymOS' });
      router.push('/gym');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 shadow-2xl shadow-black/20">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-100">Create your account</h1>
          <p className="text-sm text-slate-400 mt-1">Set up your gym in minutes</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    index < currentStep
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30'
                      : index === currentStep
                        ? 'bg-indigo-500/20 border-2 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/20'
                        : 'bg-white/5 border border-white/10 text-slate-500'
                  }`}
                >
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span
                  className={`text-[10px] mt-1.5 font-medium ${
                    index <= currentStep ? 'text-indigo-400' : 'text-slate-500'
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-2 mb-5 transition-colors duration-300 ${
                    index < currentStep
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-500'
                      : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Info */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input {...register('firstName')} className={inputClass} placeholder="John" />
                    </div>
                    {errors.firstName && <p className="text-xs text-red-400">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input {...register('lastName')} className={inputClass} placeholder="Doe" />
                    </div>
                    {errors.lastName && <p className="text-xs text-red-400">{errors.lastName.message}</p>}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input {...register('email')} type="email" className={inputClass} placeholder="you@example.com" />
                  </div>
                  {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input {...register('phone')} className={inputClass} placeholder="+94771234567" />
                  </div>
                  {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input {...register('password')} type="password" className={inputClass} placeholder="••••••••" />
                  </div>
                  {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input {...register('confirmPassword')} type="password" className={inputClass} placeholder="••••••••" />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
                </div>
              </motion.div>
            )}

            {/* Step 2: Gym Details */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Gym Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      {...register('gymName')}
                      onChange={(e) => {
                        register('gymName').onChange(e);
                        setValue('gymSlug', slugify(e.target.value));
                      }}
                      className={inputClass}
                      placeholder="Iron Paradise Gym"
                    />
                  </div>
                  {errors.gymName && <p className="text-xs text-red-400">{errors.gymName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">URL Slug</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">gymos.com/</span>
                    <input
                      {...register('gymSlug')}
                      className="w-full rounded-lg bg-white/5 border border-white/10 pl-24 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                      placeholder="iron-paradise"
                    />
                  </div>
                  {errors.gymSlug && <p className="text-xs text-red-400">{errors.gymSlug.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input {...register('gymAddress')} className={inputClass} placeholder="123 Fitness St, Colombo" />
                  </div>
                  {errors.gymAddress && <p className="text-xs text-red-400">{errors.gymAddress.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Gym Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input {...register('gymPhone')} className={inputClass} placeholder="+94112345678" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Gym Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input {...register('gymEmail')} type="email" className={inputClass} placeholder="info@gym.com" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Select Plan */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setValue('plan', plan.id)}
                      className={`relative rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-indigo-500/10 border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                          : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-2.5 right-4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                          Popular
                        </span>
                      )}
                      <div className="flex items-start gap-3">
                        <div
                          className={`rounded-lg p-2 ${
                            isSelected ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between">
                            <h3 className="font-semibold text-slate-200">{plan.name}</h3>
                            <div className="text-right">
                              <span className="text-lg font-bold text-slate-100">
                                {plan.price === 0 ? 'Free' : `LKR ${plan.price.toLocaleString()}`}
                              </span>
                              {plan.price > 0 && (
                                <span className="text-xs text-slate-500">{plan.period}</span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{plan.description}</p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                            {plan.features.slice(0, 4).map((f) => (
                              <span key={f} className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                                <Check className="w-3 h-3 text-indigo-400" />
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}
            {currentStep < 2 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110 transition-all"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110 disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Account
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
