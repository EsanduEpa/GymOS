"use client";

import { motion } from "framer-motion";
import { Save, User, Lock, Bell, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MemberProfilePage() {
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-8 pb-10"
    >
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-slate-400 mt-1">Manage your personal information and preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Info */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-indigo-400" /> Personal Information
              </CardTitle>
              <CardDescription className="text-slate-400">Update your basic profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-8">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-4 border-slate-950">
                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                    <AvatarFallback className="bg-indigo-600 text-xl">JD</AvatarFallback>
                  </Avatar>
                  <button type="button" className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 w-full space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                      <Input id="firstName" defaultValue="John" className="bg-slate-950 border-white/10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" className="bg-slate-950 border-white/10 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" className="bg-slate-950 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+94 77 123 4567" className="bg-slate-950 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-slate-300">Date of Birth</Label>
                  <Input id="dob" type="date" defaultValue="1992-05-15" className="bg-slate-950 border-white/10 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Password */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Lock className="h-5 w-5 mr-2 text-indigo-400" /> Security
              </CardTitle>
              <CardDescription className="text-slate-400">Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-slate-300">Current Password</Label>
                  <Input id="currentPassword" type="password" className="bg-slate-950 border-white/10 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                  <Input id="newPassword" type="password" className="bg-slate-950 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-300">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" className="bg-slate-950 border-white/10 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Bell className="h-5 w-5 mr-2 text-indigo-400" /> Notifications
              </CardTitle>
              <CardDescription className="text-slate-400">Choose what you want to be notified about.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-white/5">
                <div>
                  <h4 className="font-medium text-white">Class Reminders</h4>
                  <p className="text-sm text-slate-400">Get notified 2 hours before your booked class starts.</p>
                </div>
                {/* Simulated Toggle Switch */}
                <div className="w-11 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-white/5">
                <div>
                  <h4 className="font-medium text-white">Workout Assigned</h4>
                  <p className="text-sm text-slate-400">Receive an email when your trainer assigns a new workout.</p>
                </div>
                <div className="w-11 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-white/5">
                <div>
                  <h4 className="font-medium text-white">Marketing & Offers</h4>
                  <p className="text-sm text-slate-400">Receive news, special offers, and gym announcements.</p>
                </div>
                <div className="w-11 h-6 bg-slate-700 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
