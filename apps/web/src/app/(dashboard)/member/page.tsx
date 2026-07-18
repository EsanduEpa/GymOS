"use client";

import { motion } from "framer-motion";
import { Calendar, Activity, CreditCard, ChevronRight, Dumbbell, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const upcomingClasses = [
  { id: 1, name: "HIIT Blast", time: "Today, 18:00", trainer: "Sarah K.", type: "Cardio" },
  { id: 2, name: "Power Yoga", time: "Tomorrow, 07:00", trainer: "Mike T.", type: "Flexibility" },
];

const recentWorkouts = [
  {
    id: 1,
    title: "Upper Body Hypertrophy",
    trainer: "Alex J.",
    date: "Yesterday",
    notes: "Great job pushing through the last set of bench presses!",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    title: "Leg Day Madness",
    trainer: "Alex J.",
    date: "3 days ago",
    notes: "New PR on squats! 100kg for 5 reps.",
    image: null,
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MemberDashboard() {
  const daysRemaining = 14;
  const totalDays = 30;
  const progressPercent = ((totalDays - daysRemaining) / totalDays) * 100;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, John!</h1>
        <p className="text-slate-400 mt-1">Ready to crush your goals today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Subscription Status */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="bg-gradient-to-br from-indigo-900/50 to-slate-900/80 backdrop-blur-xl border-indigo-500/30 overflow-hidden relative h-full">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap className="h-32 w-32 text-indigo-400" />
            </div>
            <CardContent className="p-8 h-full flex flex-col justify-center">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Badge variant="outline" className="border-indigo-400/50 text-indigo-300 mb-2">Pro Plan</Badge>
                  <h2 className="text-2xl font-bold text-white">Active Membership</h2>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-white">{daysRemaining}</span>
                  <span className="text-slate-400 block text-sm">days left</span>
                </div>
              </div>
              
              <div className="space-y-2 mt-auto">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Started 16 days ago</span>
                  <span>Renews in {daysRemaining} days</span>
                </div>
                <div className="h-2 w-full bg-slate-950/50 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="grid grid-rows-2 gap-4">
          <Button className="h-full bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 text-white justify-start px-6 rounded-xl group" asChild>
            <Link href="/member/classes">
              <div className="bg-indigo-500/20 p-3 rounded-lg mr-4 group-hover:bg-indigo-500/30 transition-colors">
                <Calendar className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-lg">Book Class</div>
                <div className="text-xs text-slate-400">Reserve your spot</div>
              </div>
            </Link>
          </Button>
          <Button className="h-full bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 text-white justify-start px-6 rounded-xl group" asChild>
            <Link href="/member/workouts">
              <div className="bg-violet-500/20 p-3 rounded-lg mr-4 group-hover:bg-violet-500/30 transition-colors">
                <Dumbbell className="h-6 w-6 text-violet-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-lg">Workouts</div>
                <div className="text-xs text-slate-400">View your routines</div>
              </div>
            </Link>
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Classes */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-400" /> My Schedule
            </h3>
            <Button variant="link" className="text-indigo-400 hover:text-indigo-300 h-auto p-0" asChild>
              <Link href="/member/classes">View all</Link>
            </Button>
          </div>
          
          <div className="space-y-3">
            {upcomingClasses.map((cls) => (
              <Card key={cls.id} className="bg-slate-900/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{cls.name}</h4>
                    <p className="text-sm text-slate-400 mt-1">{cls.time} • {cls.trainer}</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/5 text-slate-300">
                    {cls.type}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Recent Workouts Feed */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-400" /> Recent Activity
            </h3>
          </div>
          
          <div className="space-y-4">
            {recentWorkouts.map((workout) => (
              <Card key={workout.id} className="bg-slate-900/40 backdrop-blur-xl border-white/10 overflow-hidden">
                <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3">
                  <Avatar className="h-10 w-10 border border-white/10">
                    <AvatarFallback>TR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">{workout.trainer} <span className="text-slate-400 font-normal">logged a session</span></p>
                    <p className="text-xs text-slate-500">{workout.date}</p>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="bg-black/20 rounded-lg p-3 border border-white/5 mb-3">
                    <h5 className="font-medium text-white text-sm mb-1">{workout.title}</h5>
                    <p className="text-sm text-slate-300">{workout.notes}</p>
                  </div>
                  {workout.image && (
                    <div className="rounded-lg overflow-hidden h-32">
                      <img src={workout.image} alt="Workout" className="w-full h-full object-cover" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
