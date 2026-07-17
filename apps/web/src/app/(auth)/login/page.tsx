'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, Chrome, Apple } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '@/lib/validators';
import { apiPost } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { getRoleDashboardPath } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { ApiResponse, User } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiPost<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>(
        '/api/auth/login',
        { email: data.email, password: data.password }
      );

      const result = response as unknown as { data: { user: User; accessToken: string; refreshToken: string } };
      login(result.data.user, result.data.accessToken, result.data.refreshToken);

      toast({ title: 'Welcome back!', description: `Logged in as ${result.data.user.firstName}` });

      const dashboardPath = getRoleDashboardPath(result.data.user.role);
      router.push(dashboardPath);
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 shadow-2xl shadow-black/20">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-100">Welcome back</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to your GymOS account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                {...register('email')}
                className="w-full rounded-lg bg-white/5 pl-10 pr-4 py-2.5 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="w-full rounded-lg bg-white/5 pl-10 pr-10 py-2.5 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0"
              />
              <span className="text-sm text-slate-400">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative rounded-lg bg-linear-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-slate-900/40 px-3 text-slate-500">or continue with</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all">
            <Chrome className="w-4 h-4" />
            Google
          </button>
          <button className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all">
            <Apple className="w-4 h-4" />
            Apple
          </button>
        </div>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
