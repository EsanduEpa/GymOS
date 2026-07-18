"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timeSlots = ["06:00", "07:00", "08:00", "09:00", "16:00", "17:00", "18:00", "19:00"];

const mockClasses = [
  { id: 1, day: 0, time: "07:00", name: "HIIT Blast", trainer: "Sarah K.", capacity: 20, booked: 18, color: "bg-orange-500/20 border-orange-500/50 text-orange-400" },
  { id: 2, day: 0, time: "18:00", name: "Power Yoga", trainer: "Mike T.", capacity: 15, booked: 15, color: "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" },
  { id: 3, day: 1, time: "06:00", name: "CrossFit", trainer: "Alex J.", capacity: 12, booked: 8, color: "bg-blue-500/20 border-blue-500/50 text-blue-400" },
  { id: 4, day: 2, time: "17:00", name: "Spin Class", trainer: "Sarah K.", capacity: 25, booked: 20, color: "bg-purple-500/20 border-purple-500/50 text-purple-400" },
  { id: 5, day: 3, time: "08:00", name: "Pilates", trainer: "Emma W.", capacity: 15, booked: 10, color: "bg-pink-500/20 border-pink-500/50 text-pink-400" },
  { id: 6, day: 4, time: "19:00", name: "Boxing", trainer: "Mike T.", capacity: 16, booked: 14, color: "bg-red-500/20 border-red-500/50 text-red-400" },
  { id: 7, day: 5, time: "09:00", name: "Weekend Warrior", trainer: "Alex J.", capacity: 30, booked: 28, color: "bg-indigo-500/20 border-indigo-500/50 text-indigo-400" },
];

export default function ClassesPage() {
  const [currentWeek, setCurrentWeek] = useState("Oct 23 - Oct 29, 2023");

  const getClassForSlot = (dayIdx: number, time: string) => {
    return mockClasses.find(c => c.day === dayIdx && c.time === time);
  };

  return (
    <motion.div
      className="space-y-6 flex flex-col h-[calc(100vh-8rem)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Class Schedule</h1>
          <p className="text-slate-400 mt-1">Manage weekly classes and instructors.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-900/50 rounded-lg p-1 border border-white/10">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-white px-4">{currentWeek}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-auto custom-scrollbar">
        <div className="min-w-[800px] h-full flex flex-col">
          {/* Days Header */}
          <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-white/10 sticky top-0 bg-slate-950/80 backdrop-blur z-10">
            <div className="p-4 border-r border-white/10 flex items-center justify-center">
              <span className="text-xs font-medium text-slate-500">TIME</span>
            </div>
            {daysOfWeek.map((day, i) => (
              <div key={day} className="p-4 text-center border-r border-white/10 last:border-r-0">
                <span className="text-sm font-medium text-slate-300">{day}</span>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="flex-1 overflow-y-auto">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-white/5 last:border-b-0 min-h-[120px]">
                {/* Time Label */}
                <div className="p-4 border-r border-white/10 flex items-start justify-center">
                  <span className="text-xs font-medium text-slate-500 mt-2">{time}</span>
                </div>
                
                {/* Day Columns for this time slot */}
                {daysOfWeek.map((_, dayIdx) => {
                  const classItem = getClassForSlot(dayIdx, time);
                  return (
                    <div key={`${dayIdx}-${time}`} className="p-2 border-r border-white/10 last:border-r-0 relative hover:bg-white/[0.02] transition-colors">
                      {classItem && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`h-full w-full rounded-lg border p-3 flex flex-col gap-2 ${classItem.color}`}
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm leading-tight text-white mb-1">
                              {classItem.name}
                            </h3>
                            <p className="text-xs opacity-80">{classItem.trainer}</p>
                          </div>
                          
                          <div className="mt-auto space-y-1.5">
                            <div className="flex items-center justify-between text-xs opacity-90">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {classItem.booked}/{classItem.capacity}
                              </span>
                              <span>{Math.round((classItem.booked / classItem.capacity) * 100)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-current rounded-full"
                                style={{ width: `${(classItem.booked / classItem.capacity) * 100}%` }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
