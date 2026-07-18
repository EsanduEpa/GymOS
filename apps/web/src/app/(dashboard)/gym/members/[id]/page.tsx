"use client";

import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Activity,
  Award,
  CreditCard,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useParams } from "next/navigation";

const mockMember = {
  id: "MEM-1234",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+94 77 123 4567",
  gender: "Male",
  dob: "1992-05-15",
  joinDate: "2023-01-10",
  status: "active",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
};

const mockSubscription = {
  planName: "Pro Membership",
  status: "active",
  startDate: "2023-01-10",
  endDate: "2024-01-10",
  autoRenew: true,
};

const mockBodyMetrics = [
  { month: "Jan", weight: 78, bodyFat: 20 },
  { month: "Feb", weight: 77.5, bodyFat: 19.5 },
  { month: "Mar", weight: 76, bodyFat: 18.8 },
  { month: "Apr", weight: 75.2, bodyFat: 18 },
  { month: "May", weight: 74, bodyFat: 17.5 },
  { month: "Jun", weight: 73.5, bodyFat: 17 },
];

const mockAttendance = [
  { date: "2023-06-15", time: "08:30 AM", type: "Gym Access" },
  { date: "2023-06-14", time: "05:00 PM", type: "HIIT Class" },
  { date: "2023-06-12", time: "07:15 AM", type: "Gym Access" },
  { date: "2023-06-10", time: "06:00 PM", type: "Yoga Class" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MemberDetailPage() {
  const params = useParams();

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Member Profile
          </h1>
          <p className="text-slate-400">
            Manage details for {mockMember.name}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 text-white">
            Suspend
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div variants={itemVariants} className="md:col-span-1 space-y-6">
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4 border-2 border-indigo-500/30">
                  <AvatarImage src={mockMember.avatar} alt={mockMember.name} />
                  <AvatarFallback className="bg-indigo-600">
                    {mockMember.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-white">
                  {mockMember.name}
                </h2>
                <p className="text-slate-400 mb-4">{mockMember.id}</p>
                <Badge
                  variant={mockMember.status === "active" ? "default" : "destructive"}
                  className={
                    mockMember.status === "active"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                      : ""
                  }
                >
                  {mockMember.status.charAt(0).toUpperCase() + mockMember.status.slice(1)}
                </Badge>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center text-slate-300">
                  <Mail className="h-4 w-4 mr-3 text-indigo-400" />
                  <span className="text-sm">{mockMember.email}</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Phone className="h-4 w-4 mr-3 text-indigo-400" />
                  <span className="text-sm">{mockMember.phone}</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <User className="h-4 w-4 mr-3 text-indigo-400" />
                  <span className="text-sm">{mockMember.gender}</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Calendar className="h-4 w-4 mr-3 text-indigo-400" />
                  <span className="text-sm">DOB: {mockMember.dob}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Award className="h-24 w-24 text-indigo-500" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-indigo-400" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400">Current Plan</p>
                  <p className="font-medium text-white text-lg">
                    {mockSubscription.planName}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Start Date</p>
                    <p className="font-medium text-white">
                      {mockSubscription.startDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">End Date</p>
                    <p className="font-medium text-white">
                      {mockSubscription.endDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-sm text-slate-300">Auto-Renew</span>
                  <Badge
                    variant="outline"
                    className="border-indigo-500/30 text-indigo-400"
                  >
                    {mockSubscription.autoRenew ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="md:col-span-2 space-y-6">
          {/* Body Metrics Chart */}
          <motion.div variants={itemVariants}>
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-indigo-400" />
                  Body Weight Metrics
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Weight progress over the last 6 months (kg)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockBodyMetrics}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={['dataMin - 2', 'dataMax + 2']}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                        itemStyle={{ color: "#818cf8" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#818cf8"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#818cf8", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#c084fc", strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Attendance History */}
          <motion.div variants={itemVariants}>
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-indigo-400" />
                  Recent Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAttendance.map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {record.type}
                          </p>
                          <p className="text-xs text-slate-400">
                            {record.date} at {record.time}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-white/10 text-slate-300">
                        Attended
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
