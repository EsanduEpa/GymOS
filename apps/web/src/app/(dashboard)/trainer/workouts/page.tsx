"use client";

import { motion } from "framer-motion";
import { Plus, Clock, Target, Dumbbell, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const mockWorkouts = [
  {
    id: 1,
    title: "Full Body Hypertrophy",
    difficulty: "Intermediate",
    duration: "60 min",
    muscles: ["Chest", "Back", "Legs"],
    exercisesCount: 8,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Core Crusher",
    difficulty: "Advanced",
    duration: "30 min",
    muscles: ["Abs", "Obliques"],
    exercisesCount: 6,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Beginner Strength",
    difficulty: "Beginner",
    duration: "45 min",
    muscles: ["Full Body"],
    exercisesCount: 5,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "HIIT Cardio Blast",
    difficulty: "Intermediate",
    duration: "25 min",
    muscles: ["Cardio", "Legs"],
    exercisesCount: 10,
    image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=1000&auto=format&fit=crop",
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

const getDifficultyColor = (diff: string) => {
  switch (diff) {
    case "Beginner": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Intermediate": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Advanced": return "bg-red-500/20 text-red-400 border-red-500/30";
    default: return "bg-slate-500/20 text-slate-400";
  }
};

export default function WorkoutsPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Workout Library</h1>
          <p className="text-slate-400 mt-1">Manage your workout templates and routines.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20" asChild>
          <Link href="/trainer/workouts/create">
            <Plus className="h-4 w-4 mr-2" /> Create Workout
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockWorkouts.map((workout) => (
          <motion.div key={workout.id} variants={itemVariants}>
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 overflow-hidden group hover:border-indigo-500/50 transition-all duration-300">
              <div className="h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                <img 
                  src={workout.image} 
                  alt={workout.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge 
                  variant="outline" 
                  className={`absolute top-4 right-4 z-20 ${getDifficultyColor(workout.difficulty)}`}
                >
                  {workout.difficulty}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {workout.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {workout.duration}</span>
                  <span className="flex items-center gap-1"><Dumbbell className="h-4 w-4" /> {workout.exercisesCount} Exercises</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {workout.muscles.map((muscle) => (
                    <Badge key={muscle} variant="secondary" className="bg-white/5 text-slate-300 hover:bg-white/10 border-white/10">
                      <Target className="h-3 w-3 mr-1" />
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="p-4 bg-white/[0.02] border-t border-white/5 flex gap-3">
                <Button variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/10">
                  Edit
                </Button>
                <Button className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/30">
                  <PlayCircle className="h-4 w-4 mr-2" /> Start
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
