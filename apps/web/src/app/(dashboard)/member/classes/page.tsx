"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Check, AlertCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const myBookings = [
  { id: 1, name: "HIIT Blast", date: "Today", time: "18:00 - 18:45", trainer: "Sarah K.", type: "Cardio" },
];

const availableClasses = [
  { id: 2, name: "Power Yoga", date: "Tomorrow", time: "07:00 - 08:00", trainer: "Mike T.", type: "Mind & Body", available: 5, total: 15 },
  { id: 3, name: "CrossFit WOD", date: "Tomorrow", time: "17:30 - 18:30", trainer: "Alex J.", type: "Strength", available: 2, total: 20 },
  { id: 4, name: "Spin Class", date: "Wed, Oct 25", time: "06:30 - 07:15", trainer: "Emma W.", type: "Cardio", available: 12, total: 25 },
  { id: 5, name: "Pilates Core", date: "Wed, Oct 25", time: "18:00 - 19:00", trainer: "Sarah K.", type: "Mind & Body", available: 0, total: 12 }, // Full
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MemberClassesPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

  const handleBook = (className: string) => {
    toast({
      title: "Class Booked!",
      description: `You are confirmed for ${className}. See you there!`,
    });
  };

  const handleCancel = (className: string) => {
    toast({
      title: "Booking Cancelled",
      description: `Your reservation for ${className} has been cancelled.`,
    });
  };

  const filteredClasses = activeTab === "all" 
    ? availableClasses 
    : availableClasses.filter(c => c.type.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Classes</h1>
        <p className="text-slate-400 mt-1">Book your next workout session.</p>
      </div>

      {/* My Bookings Section */}
      {myBookings.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Check className="h-5 w-5 text-emerald-400" /> My Upcoming Classes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myBookings.map((booking) => (
              <motion.div key={booking.id} variants={itemVariants}>
                <Card className="bg-emerald-900/20 backdrop-blur-xl border-emerald-500/30">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-white text-lg">{booking.name}</h3>
                        <p className="text-emerald-400 text-sm font-medium">{booking.date}</p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30">Booked</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-slate-300">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 opacity-70" /> {booking.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 opacity-70" /> {booking.trainer}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 bg-black/20 border-t border-emerald-500/20 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleCancel(booking.name)} className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300">
                      Cancel Booking
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Schedule Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-400" /> Class Schedule
          </h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-slate-900/60 border border-white/10 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">All</TabsTrigger>
              <TabsTrigger value="cardio" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Cardio</TabsTrigger>
              <TabsTrigger value="strength" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Strength</TabsTrigger>
              <TabsTrigger value="mind" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Mind & Body</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <motion.div key={cls.id} variants={itemVariants}>
              <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 h-full flex flex-col">
                <CardHeader className="p-5 pb-0 flex flex-row items-start justify-between">
                  <div>
                    <Badge variant="secondary" className="bg-white/5 text-slate-300 mb-2">
                      {cls.type}
                    </Badge>
                    <h3 className="font-bold text-white text-xl">{cls.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="block font-medium text-indigo-400">{cls.date}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="p-5 flex-1">
                  <div className="space-y-3 mt-2 text-sm text-slate-300">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/5 p-1.5 rounded-md">
                        <Clock className="h-4 w-4 text-slate-400" />
                      </div>
                      <span>{cls.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-white/5 p-1.5 rounded-md">
                        <User className="h-4 w-4 text-slate-400" />
                      </div>
                      <span>{cls.trainer}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Spots Available</span>
                      <span className={cls.available === 0 ? "text-red-400" : "text-emerald-400"}>
                        {cls.available} / {cls.total}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${cls.available === 0 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${((cls.total - cls.available) / cls.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-5 pt-0 mt-auto">
                  {cls.available > 0 ? (
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => handleBook(cls.name)}
                    >
                      Book Class
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-not-allowed"
                      disabled
                    >
                      <AlertCircle className="h-4 w-4 mr-2" /> Class Full
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
