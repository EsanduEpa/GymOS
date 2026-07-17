'use client';

import { motion } from 'framer-motion';
import { Users, CreditCard, Banknote, Calendar, Plus, UserPlus, Dumbbell } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { StatCard } from '@/components/ui/stat-card';
import { formatCurrency, getRelativeTime } from '@/lib/utils';

const membershipData = [
  { name: 'Feb', value: 120 },
  { name: 'Mar', value: 145 },
  { name: 'Apr', value: 162 },
  { name: 'May', value: 178 },
  { name: 'Jun', value: 195 },
  { name: 'Jul', value: 218 },
];

const revenueData = [
  { name: 'Feb', value: 385000 },
  { name: 'Mar', value: 420000 },
  { name: 'Apr', value: 475000 },
  { name: 'May', value: 510000 },
  { name: 'Jun', value: 540000 },
  { name: 'Jul', value: 612000 },
];

const recentActivity = [
  {
    id: '1',
    type: 'member_joined' as const,
    title: 'New Member Joined',
    description: 'Kasun Perera signed up for the Premium plan',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    avatar: 'KP',
  },
  {
    id: '2',
    type: 'payment_received' as const,
    title: 'Payment Received',
    description: 'LKR 5,000 from Amaya Silva — Monthly Subscription',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    avatar: 'AS',
  },
  {
    id: '3',
    type: 'class_booked' as const,
    title: 'Class Booked',
    description: 'Nadeesha Fernando booked Morning Yoga',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    avatar: 'NF',
  },
  {
    id: '4',
    type: 'workout_posted' as const,
    title: 'Workout Posted',
    description: 'Trainer Ruwan posted "Upper Body Blast"',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    avatar: 'RK',
  },
  {
    id: '5',
    type: 'subscription_expired' as const,
    title: 'Subscription Expired',
    description: 'Dinesh Jayawardena\'s subscription has expired',
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
    avatar: 'DJ',
  },
];

const activityColors: Record<string, string> = {
  member_joined: 'bg-emerald-500',
  payment_received: 'bg-indigo-500',
  class_booked: 'bg-violet-500',
  workout_posted: 'bg-amber-500',
  subscription_expired: 'bg-red-500',
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function GymDashboardPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Page Title */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Welcome back! Here&apos;s what&apos;s happening at your gym.</p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Total Members"
          value="218"
          trend={12.5}
        />
        <StatCard
          icon={<CreditCard className="w-5 h-5" />}
          label="Active Subscriptions"
          value="195"
          trend={8.3}
        />
        <StatCard
          icon={<Banknote className="w-5 h-5" />}
          label="Revenue This Month"
          value={formatCurrency(612000)}
          trend={13.4}
        />
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label="Classes Today"
          value="8"
          trend={-5.2}
        />
      </motion.div>

      {/* Charts */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Growth */}
        <div className="rounded-xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Membership Growth</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={membershipData}>
              <defs>
                <linearGradient id="memberGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,15,25,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#memberGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="rounded-xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,15,25,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              />
              <Bar dataKey="value" fill="url(#revenueGradient)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Activity + Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 rounded-xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                    {activity.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${activityColors[activity.type]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{activity.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.description}</p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {getRelativeTime(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 rounded-lg bg-linear-to-r from-indigo-500/15 to-violet-500/10 border border-indigo-500/20 px-4 py-3 text-sm font-medium text-slate-200 hover:from-indigo-500/25 hover:to-violet-500/20 transition-all">
              <UserPlus className="w-4 h-4 text-indigo-400" />
              Add Member
            </button>
            <button className="w-full flex items-center gap-3 rounded-lg bg-linear-to-r from-violet-500/15 to-purple-500/10 border border-violet-500/20 px-4 py-3 text-sm font-medium text-slate-200 hover:from-violet-500/25 hover:to-purple-500/20 transition-all">
              <Calendar className="w-4 h-4 text-violet-400" />
              Create Class
            </button>
            <button className="w-full flex items-center gap-3 rounded-lg bg-linear-to-r from-purple-500/15 to-pink-500/10 border border-purple-500/20 px-4 py-3 text-sm font-medium text-slate-200 hover:from-purple-500/25 hover:to-pink-500/20 transition-all">
              <Dumbbell className="w-4 h-4 text-purple-400" />
              Post Workout
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
