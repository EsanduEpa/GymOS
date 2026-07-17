'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validators';
import { apiPost } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await apiPost('/api/auth/forgot-password', data);
      setSubmitted(true);
      toast({ title: 'Email sent', description: 'Check your inbox for reset instructions' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
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
        {submitted ? (
          <div className="text-center py-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold text-slate-100 mb-2">Check your email</h1>
            <p className="text-sm text-slate-400 mb-6">
              We&apos;ve sent password reset instructions to your email address. The link will expire in 1 hour.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-100">Forgot password?</h1>
              <p className="text-sm text-slate-400 mt-1">
                Enter your email and we&apos;ll send you reset instructions
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-linear-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110 disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    Sending...
                  </span>
                ) : (
                  'Send reset link'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
