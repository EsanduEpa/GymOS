"use client";

import { motion } from "framer-motion";
import { Plus, MessageCircle, Heart, Share2, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const mockSessions = [
  {
    id: 1,
    trainer: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?u=TR1",
    workoutName: "Upper Body Power",
    client: "Sarah Jenkins",
    notes: "Sarah hit a new PR on the bench press today! Form was looking solid, and we pushed through the sticking point we've been working on for weeks. Very proud of the progress.",
    timestamp: "2 hours ago",
    visibility: "Public",
    likes: 12,
    comments: 3,
    images: ["https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800"],
  },
  {
    id: 2,
    trainer: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?u=TR1",
    workoutName: "Morning CrossFit Class",
    client: "Group Class",
    notes: "Brutal WOD today, but everyone survived. The energy in the room was electric during the final AMRAP.",
    timestamp: "5 hours ago",
    visibility: "Public",
    likes: 45,
    comments: 8,
    images: [],
  },
  {
    id: 3,
    trainer: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?u=TR1",
    workoutName: "Rehab & Mobility",
    client: "David Smith",
    notes: "Focused on shoulder mobility today. Range of motion has improved by ~15% since last week. Continuing with band pull-aparts and external rotations as homework.",
    timestamp: "Yesterday",
    visibility: "Private",
    likes: 0,
    comments: 0,
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function SessionsFeedPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="flex justify-between items-center bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 sticky top-4 z-10 shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white">Session Feed</h1>
          <p className="text-sm text-slate-400">Updates from your training sessions</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20" asChild>
          <Link href="/trainer/sessions/create">
            <Plus className="h-4 w-4 mr-2" /> Log Session
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        {mockSessions.map((session) => (
          <motion.div key={session.id} variants={itemVariants}>
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12 border-2 border-indigo-500/20">
                    <AvatarImage src={session.avatar} />
                    <AvatarFallback>TR</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{session.trainer}</h3>
                      <span className="text-slate-500 text-sm">with</span>
                      <span className="font-medium text-indigo-400">{session.client}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-slate-400">{session.timestamp}</p>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs font-medium text-slate-300 bg-white/5 px-2 py-0.5 rounded-md flex items-center gap-1">
                        {session.visibility === 'Public' ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                        {session.visibility}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 text-sm font-medium mb-2">
                  💪 Workout: {session.workoutName}
                </div>
                
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  {session.notes}
                </p>

                {session.images.length > 0 && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-white/5">
                    <img src={session.images[0]} alt="Session photo" className="w-full h-auto max-h-[400px] object-cover" />
                  </div>
                )}
              </CardContent>

              {session.visibility === "Public" && (
                <CardFooter className="border-t border-white/5 pt-4 px-6 flex gap-6">
                  <button className="flex items-center gap-2 text-slate-400 hover:text-pink-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                      <Heart className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{session.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{session.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors group ml-auto">
                    <div className="p-2 rounded-full group-hover:bg-emerald-500/10 transition-colors">
                      <Share2 className="h-5 w-5" />
                    </div>
                  </button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
