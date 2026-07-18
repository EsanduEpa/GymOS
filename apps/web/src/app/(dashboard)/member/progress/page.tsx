"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Trophy, Activity, ArrowUpRight, ArrowDownRight, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const bodyMetrics = [
  { date: "Jan", weight: 82, bodyFat: 22 },
  { date: "Feb", weight: 81, bodyFat: 21.5 },
  { date: "Mar", weight: 80, bodyFat: 20.8 },
  { date: "Apr", weight: 79.5, bodyFat: 20 },
  { date: "May", weight: 78, bodyFat: 19 },
  { date: "Jun", weight: 77.2, bodyFat: 18.5 },
];

const personalRecords = [
  { exercise: "Bench Press", weight: "85kg", date: "Oct 15, 2023", trend: "up" },
  { exercise: "Squat", weight: "120kg", date: "Oct 22, 2023", trend: "up" },
  { exercise: "Deadlift", weight: "140kg", date: "Sep 30, 2023", trend: "stable" },
  { exercise: "5K Run", time: "24:30", date: "Oct 10, 2023", trend: "up" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MemberProgressPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Progress Tracking</h1>
          <p className="text-slate-400 mt-1">Monitor your body metrics and personal records.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
              <Plus className="h-4 w-4 mr-2" /> Log Measurement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-slate-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Log New Measurement</DialogTitle>
              <DialogDescription className="text-slate-400">
                Enter your latest body metrics to track your progress.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weight" className="text-right text-slate-300">Weight (kg)</Label>
                <Input id="weight" type="number" step="0.1" className="col-span-3 bg-slate-950 border-white/10 text-white" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bf" className="text-right text-slate-300">Body Fat (%)</Label>
                <Input id="bf" type="number" step="0.1" className="col-span-3 bg-slate-950 border-white/10 text-white" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right text-slate-300">Date</Label>
                <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="col-span-3 bg-slate-950 border-white/10 text-white" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Metrics</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Scale className="h-5 w-5 mr-2 text-indigo-400" /> Body Weight Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bodyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                      itemStyle={{ color: "#818cf8" }}
                    />
                    <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: "#818cf8" }} activeDot={{ r: 6, fill: "#c084fc" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Activity className="h-5 w-5 mr-2 text-emerald-400" /> Body Fat %
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bodyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                      itemStyle={{ color: "#10b981" }}
                    />
                    <Line type="monotone" dataKey="bodyFat" name="Body Fat %" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* PRs */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 sticky top-6">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-amber-400" /> Personal Records
              </CardTitle>
              <CardDescription className="text-slate-400">Your all-time best performances.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personalRecords.map((pr, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div>
                      <p className="font-semibold text-white">{pr.exercise}</p>
                      <p className="text-xs text-slate-400">{pr.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-indigo-300">{pr.weight || pr.time}</span>
                      {pr.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                      ) : pr.trend === 'down' ? (
                        <ArrowDownRight className="h-4 w-4 text-red-400" />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6 border-white/10 text-white hover:bg-white/5">
                View All Records
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
