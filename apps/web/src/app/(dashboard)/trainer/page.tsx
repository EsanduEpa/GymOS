"use client";

import { motion } from "framer-motion";
import { Users, Calendar as CalendarIcon, Dumbbell, Activity, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const stats = [
  { title: "Classes This Week", value: "12", icon: CalendarIcon, color: "text-blue-400", bg: "bg-blue-500/20" },
  { title: "Total Clients", value: "48", icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/20" },
  { title: "Workouts Posted", value: "156", icon: Dumbbell, color: "text-purple-400", bg: "bg-purple-500/20" },
];

const todaysClasses = [
  { id: 1, name: "Morning HIIT", time: "07:00 AM", duration: "45 min", enrolled: 18, capacity: 20 },
  { id: 2, name: "Strength Fundamentals", time: "10:30 AM", duration: "60 min", enrolled: 12, capacity: 15 },
  { id: 3, name: "Evening CrossFit", time: "06:00 PM", duration: "60 min", enrolled: 25, capacity: 25 },
];

const recentPosts = [
  {
    id: 1,
    title: "Upper Body Power",
    client: "Sarah J.",
    date: "2 hours ago",
    content: "Great progress on bench press today. Form is looking solid, bumped up by 5kg.",
    type: "Personal Training",
  },
  {
    id: 2,
    title: "Leg Day Madness",
    client: "Public Group",
    date: "5 hours ago",
    content: "Squat intervals were brutal but everyone crushed it. Make sure to stretch tonight!",
    type: "Class Workout",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TrainerDashboard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, Coach!</h1>
          <p className="text-slate-400 mt-1">Here is what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 text-white" asChild>
            <Link href="/trainer/workouts/create">Create Workout</Link>
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
            <Link href="/trainer/sessions/create">Log Session</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`h-7 w-7 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Classes */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-400" /> Today's Schedule
            </h2>
          </div>
          
          <div className="space-y-4">
            {todaysClasses.map((cls) => (
              <Card key={cls.id} className="bg-slate-900/40 backdrop-blur-xl border-white/10 hover:border-indigo-500/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{cls.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {cls.time}</span>
                        <span>•</span>
                        <span>{cls.duration}</span>
                      </div>
                    </div>
                    {cls.enrolled === cls.capacity ? (
                      <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">Full</Badge>
                    ) : (
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">Open</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{cls.enrolled} Enrolled</span>
                      <span>{cls.capacity} Capacity</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${cls.enrolled === cls.capacity ? 'bg-red-500' : 'bg-indigo-500'}`}
                        style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Recent Session Posts */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-400" /> Recent Sessions
            </h2>
            <Button variant="link" className="text-indigo-400 hover:text-indigo-300" asChild>
              <Link href="/trainer/sessions">View All <ChevronRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>

          <div className="space-y-4">
            {recentPosts.map((post) => (
              <Card key={post.id} className="bg-slate-900/40 backdrop-blur-xl border-white/10">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${post.id}`} />
                        <AvatarFallback className="bg-indigo-600">TR</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-white">{post.client}</h4>
                        <p className="text-xs text-slate-400">{post.date}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-white/5 text-slate-300">
                      {post.type}
                    </Badge>
                  </div>
                  
                  <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                    <h5 className="font-medium text-white mb-2">{post.title}</h5>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
