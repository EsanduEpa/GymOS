"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Calendar, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockWorkouts = [
  {
    id: 1,
    title: "Leg Day Madness",
    trainer: "Alex J.",
    trainerAvatar: "https://i.pravatar.cc/150?u=TR1",
    date: "Today",
    difficulty: "Advanced",
    type: "Personal Training",
    notes: "Great job pushing through the squats. Form looks solid.",
    exercises: [
      { name: "Barbell Squat", sets: [ { reps: 5, weight: 100 }, { reps: 5, weight: 105 }, { reps: 5, weight: 105 } ] },
      { name: "Leg Press", sets: [ { reps: 10, weight: 200 }, { reps: 10, weight: 200 }, { reps: 10, weight: 200 } ] },
    ],
  },
  {
    id: 2,
    title: "Upper Body Pump",
    trainer: "Alex J.",
    trainerAvatar: "https://i.pravatar.cc/150?u=TR1",
    date: "Oct 24",
    difficulty: "Intermediate",
    type: "Public Group",
    notes: "Solid upper body session for everyone.",
    exercises: [
      { name: "Bench Press", sets: [ { reps: 10, weight: 60 }, { reps: 8, weight: 65 }, { reps: 6, weight: 70 } ] },
      { name: "Pull-ups", sets: [ { reps: 8, weight: "BW" }, { reps: 8, weight: "BW" }, { reps: 6, weight: "BW" } ] },
    ],
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

export default function MemberWorkoutsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Beginner": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Intermediate": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "Advanced": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">My Workouts</h1>
        <p className="text-slate-400 mt-1">Review past sessions and assigned programs.</p>
      </div>

      <div className="space-y-6">
        {mockWorkouts.map((workout) => (
          <motion.div key={workout.id} variants={itemVariants}>
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 overflow-hidden">
              <CardHeader 
                className="p-6 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => toggleExpand(workout.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-500/20 p-3 rounded-xl shrink-0">
                      <Dumbbell className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold text-white">{workout.title}</h2>
                        <Badge variant="outline" className={getDifficultyColor(workout.difficulty)}>
                          {workout.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {workout.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={workout.trainerAvatar} />
                            <AvatarFallback>TR</AvatarFallback>
                          </Avatar>
                          {workout.trainer}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-400 self-end sm:self-auto shrink-0">
                    {expandedId === workout.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </Button>
                </div>
              </CardHeader>
              
              <AnimatePresence>
                {expandedId === workout.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <CardContent className="p-6 pt-0 border-t border-white/5">
                      {workout.notes && (
                        <div className="bg-white/5 p-4 rounded-xl mt-4 mb-6 border border-white/5">
                          <p className="text-sm text-slate-300 italic">&ldquo;{workout.notes}&rdquo;</p>
                        </div>
                      )}
                      
                      <div className="space-y-6">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Completed Exercises
                        </h3>
                        
                        <div className="space-y-4">
                          {workout.exercises.map((ex, idx) => (
                            <div key={idx} className="bg-slate-950/50 rounded-lg p-4 border border-white/5">
                              <h4 className="font-medium text-white mb-3">{ex.name}</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {ex.sets.map((set, setIdx) => (
                                  <div key={setIdx} className="bg-slate-900 border border-white/5 p-2 rounded flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Set {setIdx + 1}</span>
                                    <span className="text-white font-medium">
                                      {set.reps} x {set.weight}{typeof set.weight === 'number' ? 'kg' : ''}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
