"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Users, MapPin, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const upcomingClasses = [
  {
    id: 1,
    name: "Morning HIIT",
    time: "07:00 AM - 08:00 AM",
    date: "Today",
    room: "Studio 1",
    enrolled: 12,
    capacity: 15,
    status: "Upcoming",
  },
  {
    id: 2,
    name: "Advanced Crossfit",
    time: "05:00 PM - 06:30 PM",
    date: "Today",
    room: "Main Floor",
    enrolled: 20,
    capacity: 20,
    status: "Full",
  },
  {
    id: 3,
    name: "Core & Mobility",
    time: "08:00 AM - 09:00 AM",
    date: "Tomorrow",
    room: "Studio 2",
    enrolled: 8,
    capacity: 15,
    status: "Upcoming",
  }
];

const pastClasses = [
  {
    id: 4,
    name: "Evening Yoga Flow",
    time: "06:00 PM - 07:00 PM",
    date: "Yesterday",
    room: "Studio 1",
    enrolled: 14,
    capacity: 15,
    status: "Completed",
  },
  {
    id: 5,
    name: "Morning HIIT",
    time: "07:00 AM - 08:00 AM",
    date: "Yesterday",
    room: "Studio 1",
    enrolled: 10,
    capacity: 15,
    status: "Completed",
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

export default function TrainerClassesPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-8 pb-10"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            My Classes
          </h1>
          <p className="text-slate-400 mt-1">
            Manage your assigned group classes and view attendees.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20">
          <Calendar className="h-4 w-4 mr-2" /> Request Schedule Change
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Upcoming Classes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingClasses.map((cls) => (
            <motion.div key={cls.id} variants={itemVariants}>
              <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 hover:border-indigo-500/30 transition-colors group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                      {cls.date}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={
                        cls.status === "Full" 
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }
                    >
                      {cls.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">
                    {cls.name}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-slate-400">
                      <Clock className="h-4 w-4 mr-3 text-slate-500" />
                      {cls.time}
                    </div>
                    <div className="flex items-center text-sm text-slate-400">
                      <MapPin className="h-4 w-4 mr-3 text-slate-500" />
                      {cls.room}
                    </div>
                    <div className="flex items-center text-sm text-slate-400">
                      <Users className="h-4 w-4 mr-3 text-slate-500" />
                      <span>{cls.enrolled} / {cls.capacity} Enrolled</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
                    <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 hover:text-white">
                      View Roster
                    </Button>
                    <Button className="w-10 px-0 bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-8">
        <h2 className="text-xl font-semibold text-white text-opacity-80">
          Past Classes
        </h2>
        
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          {pastClasses.map((cls, index) => (
            <div 
              key={cls.id} 
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 ${
                index !== pastClasses.length - 1 ? 'border-b border-white/5' : ''
              } hover:bg-white/[0.02] transition-colors`}
            >
              <div className="flex items-start sm:items-center gap-4 mb-4 sm:mb-0">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{cls.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                    <span>{cls.date}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span>{cls.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 sm:ml-auto pl-14 sm:pl-0">
                <div className="text-sm text-slate-400">
                  <span className="text-white font-medium">{cls.enrolled}</span> Attendees
                </div>
                <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
