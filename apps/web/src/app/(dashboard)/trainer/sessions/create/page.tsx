"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Save, Dumbbell, Users, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const mockTemplates = [
  { id: "1", name: "Upper Body Hypertrophy" },
  { id: "2", name: "Leg Day - Strength" },
  { id: "3", name: "Core & Cardio" },
];

const mockClients = [
  { id: "c1", name: "Sarah Jenkins" },
  { id: "c2", name: "Group Class (Morning)" },
  { id: "c3", name: "David Smith" },
];

const mockExercises = [
  { id: "e1", name: "Barbell Bench Press", sets: 3 },
  { id: "e2", name: "Incline Dumbbell Press", sets: 3 },
];

export default function CreateSessionPage() {
  const { toast } = useToast();
  const [visibility, setVisibility] = useState("public");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Session Logged",
      description: "Workout session has been posted successfully.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-10"
    >
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Log Session</h1>
        <p className="text-slate-400 mt-1">Record workout results and post an update.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white">Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Client / Group</Label>
                <Select>
                  <SelectTrigger className="bg-slate-950 border-white/10 text-white">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    {mockClients.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Workout Template</Label>
                <Select>
                  <SelectTrigger className="bg-slate-950 border-white/10 text-white">
                    <SelectValue placeholder="Select template (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    {mockTemplates.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Post Title</Label>
                <Input placeholder="e.g. Great progress on bench press!" className="bg-slate-950 border-white/10 text-white" />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Trainer Notes</Label>
                <Textarea 
                  placeholder="How did the session go? Any form improvements or struggles?" 
                  className="bg-slate-950 border-white/10 text-white min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white">Media & Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Add Photos/Videos</Label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-950/50 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Camera className="h-6 w-6 text-indigo-400" />
                    </div>
                    <p className="text-sm font-medium text-white mb-1">Click to upload media</p>
                    <p className="text-xs text-slate-500">Max 4 items</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-300">Visibility</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setVisibility("public")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                        visibility === "public" 
                          ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300" 
                          : "bg-slate-950 border-white/10 text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      <Globe className="h-4 w-4" /> Public
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibility("private")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                        visibility === "private" 
                          ? "bg-slate-800 border-slate-500 text-white" 
                          : "bg-slate-950 border-white/10 text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      <Lock className="h-4 w-4" /> Private
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {visibility === "public" ? "Visible to all members in the feed." : "Only visible to the client and you."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Exercise Logs */}
        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Dumbbell className="mr-2 h-5 w-5 text-indigo-400" />
              Exercise Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockExercises.map((ex, i) => (
                <div key={ex.id} className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                  <h4 className="font-medium text-white mb-4">{ex.name}</h4>
                  <div className="space-y-3">
                    {Array.from({ length: ex.sets }).map((_, setIdx) => (
                      <div key={setIdx} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-2 text-sm text-slate-500 font-medium text-center">
                          Set {setIdx + 1}
                        </div>
                        <div className="col-span-5 flex items-center gap-2">
                          <Input type="number" placeholder="Reps" className="bg-slate-900 border-white/10 text-white h-9" />
                          <span className="text-slate-500 text-sm">reps</span>
                        </div>
                        <div className="col-span-5 flex items-center gap-2">
                          <Input type="number" placeholder="Weight" className="bg-slate-900 border-white/10 text-white h-9" />
                          <span className="text-slate-500 text-sm">kg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4 pb-12">
          <Button type="submit" size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl shadow-lg shadow-indigo-500/20">
            <Save className="h-5 w-5 mr-2" /> Post Session
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
