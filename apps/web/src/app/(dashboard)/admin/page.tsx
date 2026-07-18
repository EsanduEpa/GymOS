"use client";

import { motion } from "framer-motion";
import { Building2, Users, DollarSign, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 59000 },
  { month: "Jun", revenue: 75000 },
];

const gymGrowthData = [
  { month: "Jan", gyms: 12 },
  { month: "Feb", gyms: 15 },
  { month: "Mar", gyms: 18 },
  { month: "Apr", gyms: 24 },
  { month: "May", gyms: 28 },
  { month: "Jun", gyms: 35 },
];

const stats = [
  { title: "Total Gyms", value: "35", change: "+25%", icon: Building2, color: "text-blue-400", bg: "bg-blue-500/20" },
  { title: "Total Users", value: "12,450", change: "+15%", icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/20" },
  { title: "MRR", value: "$75,000", change: "+22%", icon: DollarSign, color: "text-purple-400", bg: "bg-purple-500/20" },
  { title: "System Health", value: "99.9%", change: "Stable", icon: Activity, color: "text-amber-400", bg: "bg-amber-500/20" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Platform Overview</h1>
        <p className="text-slate-400 mt-1">Super admin dashboard for GymOS multi-tenant platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{stat.value}</h3>
                  </div>
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {stat.title === "System Health" ? (
                    <span className="text-slate-400 flex items-center"><Activity className="h-4 w-4 mr-1" /> {stat.change}</span>
                  ) : (
                    <span className="text-emerald-400 flex items-center"><TrendingUp className="h-4 w-4 mr-1" /> {stat.change} from last month</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-xl text-white">Monthly Recurring Revenue (MRR)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                      itemStyle={{ color: "#c084fc" }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#c084fc" strokeWidth={3} dot={{ r: 4, fill: "#c084fc" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tenant Growth Chart */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-xl text-white">Tenant Growth (Active Gyms)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gymGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey="gyms" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div variants={itemVariants}>
        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader>
             <CardTitle className="text-lg text-white flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
              System Alerts
             </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-4 rounded-lg flex items-start gap-3">
               <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
               <div>
                 <h4 className="font-semibold">High Database Load Detected</h4>
                 <p className="text-sm opacity-80 mt-1">Database CPU utilization exceeded 80% for the last 15 minutes in the US-East region. Auto-scaling is currently provisioning additional read replicas.</p>
               </div>
             </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
