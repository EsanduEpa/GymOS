'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: number;
  className?: string;
}

export function StatCard({ icon, label, value, trend, className }: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group relative overflow-hidden rounded-xl',
        'bg-slate-900/40 backdrop-blur-xl border border-white/10',
        'p-6 cursor-default',
        'hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5',
        'transition-colors duration-300',
        className
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <span className="text-sm font-medium text-slate-400">{label}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100 tracking-tight">
              {value}
            </span>
            {trend !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full',
                  isPositive && 'text-emerald-400 bg-emerald-500/10',
                  isNegative && 'text-red-400 bg-red-500/10'
                )}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
        <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
