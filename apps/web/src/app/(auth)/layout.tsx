'use client';

import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-950 overflow-hidden">
      {/* Animated floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            rotate: [0, 90, 180, 360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 30, -40, 0],
            rotate: [360, 270, 180, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-500/5 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -20, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 right-1/3 w-40 h-40 rounded-full bg-purple-500/5 blur-3xl"
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-bold gradient-text-brand">GymOS</span>
        </motion.div>

        {children}
      </div>
    </div>
  );
}
