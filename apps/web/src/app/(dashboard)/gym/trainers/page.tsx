"use client";

import { motion } from "framer-motion";
import { Plus, Star, Dumbbell, Calendar, Mail, MoreVertical, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockTrainers = [
  {
    id: "TR-001",
    name: "Alex Johnson",
    email: "alex.j@gymos.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    specializations: ["CrossFit", "Strength", "HIIT"],
    rating: 4.8,
    reviews: 124,
    activeClients: 15,
    classesPerWeek: 8,
  },
  {
    id: "TR-002",
    name: "Sarah Kendall",
    email: "sarah.k@gymos.com",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    specializations: ["Yoga", "Pilates", "Mobility"],
    rating: 4.9,
    reviews: 89,
    activeClients: 22,
    classesPerWeek: 12,
  },
  {
    id: "TR-003",
    name: "Mike Tyson",
    email: "mike.t@gymos.com",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    specializations: ["Boxing", "MMA", "Conditioning"],
    rating: 4.7,
    reviews: 210,
    activeClients: 18,
    classesPerWeek: 10,
  },
  {
    id: "TR-004",
    name: "Emma Watson",
    email: "emma.w@gymos.com",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    specializations: ["Weight Loss", "Nutrition", "Cardio"],
    rating: 4.6,
    reviews: 65,
    activeClients: 10,
    classesPerWeek: 6,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export default function TrainersPage() {
  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Trainers
          </h1>
          <p className="text-slate-400 mt-1">
            Manage your coaching staff and their schedules.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Trainer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockTrainers.map((trainer) => (
          <motion.div key={trainer.id} variants={itemVariants}>
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 overflow-hidden group hover:border-indigo-500/50 transition-colors">
              <CardHeader className="p-0">
                <div className="h-24 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 relative">
                  <div className="absolute right-2 top-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                        <DropdownMenuItem className="text-slate-300 hover:text-white focus:bg-white/10 cursor-pointer">
                          <Edit className="h-4 w-4 mr-2" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:text-red-300 focus:bg-red-500/10 cursor-pointer">
                          <Trash className="h-4 w-4 mr-2" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="px-6 -mt-12 flex justify-center">
                  <Avatar className="h-24 w-24 border-4 border-slate-950 shadow-xl">
                    <AvatarImage src={trainer.avatar} alt={trainer.name} />
                    <AvatarFallback className="bg-indigo-600 text-xl">{trainer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              
              <CardContent className="px-6 pt-4 pb-6 text-center space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{trainer.name}</h3>
                  <p className="text-sm text-slate-400 mt-1 flex items-center justify-center gap-1">
                    <Mail className="h-3 w-3" />
                    {trainer.email}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {trainer.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary" className="bg-white/5 text-slate-300 hover:bg-white/10 border-white/10">
                      {spec}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-1 text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold text-white">{trainer.rating}</span>
                  <span className="text-slate-500 text-sm">({trainer.reviews})</span>
                </div>
              </CardContent>

              <CardFooter className="px-6 py-4 bg-white/5 border-t border-white/10 grid grid-cols-2 gap-4">
                <div className="text-center border-r border-white/10">
                  <p className="text-xl font-bold text-white">{trainer.activeClients}</p>
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-1">
                    <Dumbbell className="h-3 w-3" /> Clients
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{trainer.classesPerWeek}</p>
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" /> Classes/wk
                  </p>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
