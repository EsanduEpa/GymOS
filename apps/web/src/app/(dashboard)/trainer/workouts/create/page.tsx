"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Search, GripVertical, Trash2, Clock, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const mockExerciseDatabase = [
  { id: "e1", name: "Barbell Bench Press", target: "Chest" },
  { id: "e2", name: "Squat", target: "Legs" },
  { id: "e3", name: "Deadlift", target: "Back" },
  { id: "e4", name: "Pull-ups", target: "Back" },
];

export default function CreateWorkoutPage() {
  const [exercises, setExercises] = useState([
    { id: "1", name: "Barbell Bench Press", sets: 3, reps: "10", rest: "90s" }
  ]);

  const addExercise = () => {
    setExercises([
      ...exercises,
      { id: Date.now().toString(), name: "New Exercise", sets: 3, reps: "10", rest: "60s" }
    ]);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-10"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Workout Template</h1>
          <p className="text-slate-400 mt-1">Design a new workout routine for your clients.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Save className="h-4 w-4 mr-2" /> Save Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Workout Title</Label>
                <Input placeholder="e.g. Upper Body Hypertrophy" className="bg-slate-950 border-white/10 text-white text-lg" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Description</Label>
                <Textarea placeholder="Describe the focus and goals of this workout..." className="bg-slate-950 border-white/10 text-white min-h-[100px]" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Difficulty</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-950 border-white/10 text-white">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Est. Duration (min)</Label>
                  <Input type="number" placeholder="45" className="bg-slate-950 border-white/10 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl text-white">Exercises</CardTitle>
              <Button onClick={addExercise} size="sm" variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
                <Plus className="h-4 w-4 mr-2" /> Add Exercise
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input placeholder="Search exercise database..." className="bg-slate-950 border-white/10 text-white pl-9" />
              </div>

              {/* Exercise List */}
              <div className="space-y-3 mt-4">
                {exercises.map((ex, index) => (
                  <div key={ex.id} className="group flex items-start gap-4 p-4 rounded-xl bg-slate-950/50 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="mt-2 text-slate-600 cursor-grab">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-sm shrink-0 mt-1">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <Input defaultValue={ex.name} className="bg-transparent border-none text-lg font-semibold text-white p-0 h-auto focus-visible:ring-0" />
                        <Button variant="ghost" size="icon" onClick={() => removeExercise(ex.id)} className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-500 uppercase tracking-wider">Sets</Label>
                          <Input type="number" defaultValue={ex.sets} className="bg-slate-900 border-white/5 text-white h-9" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-500 uppercase tracking-wider">Reps</Label>
                          <Input defaultValue={ex.reps} className="bg-slate-900 border-white/5 text-white h-9" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-500 uppercase tracking-wider">Rest</Label>
                          <Input defaultValue={ex.rest} className="bg-slate-900 border-white/5 text-white h-9" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Preview */}
        <div className="space-y-6">
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg text-white">Workout Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span className="flex items-center"><Dumbbell className="h-4 w-4 mr-2 text-indigo-400" /> Total Exercises</span>
                <span className="font-bold text-white">{exercises.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span className="flex items-center"><Clock className="h-4 w-4 mr-2 text-indigo-400" /> Est. Time</span>
                <span className="font-bold text-white">~45 mins</span>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Exercise Flow</h4>
                <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-3 before:w-[2px] before:bg-white/5">
                  {exercises.map((ex, i) => (
                    <div key={ex.id} className="relative flex items-center gap-3 pl-8">
                      <div className="absolute left-2 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
                      <p className="text-sm font-medium text-slate-300 truncate">{ex.name}</p>
                      <Badge variant="outline" className="ml-auto text-[10px] bg-slate-950 border-white/10 text-slate-400 shrink-0">
                        {ex.sets}x{ex.reps}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
