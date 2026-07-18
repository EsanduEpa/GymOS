"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Save, Upload, Clock, Building2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

type SettingsFormValues = {
  gymName: string;
  email: string;
  phone: string;
  address: string;
  primaryColor: string;
  weekdayOpen: string;
  weekdayClose: string;
  weekendOpen: string;
  weekendClose: string;
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { register, handleSubmit } = useForm<SettingsFormValues>({
    defaultValues: {
      gymName: "Iron Forge Fitness",
      email: "hello@ironforge.com",
      phone: "+94 11 234 5678",
      address: "123 Fitness Ave, Colombo 03",
      primaryColor: "#4f46e5",
      weekdayOpen: "06:00",
      weekdayClose: "22:00",
      weekendOpen: "08:00",
      weekendClose: "20:00",
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    console.log(data);
    toast({
      title: "Settings Saved",
      description: "Your gym settings have been updated successfully.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-10"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Gym Settings
        </h1>
        <p className="text-slate-400 mt-1">
          Configure your facility details, branding, and operating hours.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-indigo-400" />
              General Information
            </CardTitle>
            <CardDescription className="text-slate-400">
              Basic details about your gym that will be shown to members.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gymName" className="text-slate-300">Gym Name</Label>
                <Input
                  id="gymName"
                  {...register("gymName")}
                  className="bg-slate-950 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="bg-slate-950 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  className="bg-slate-950 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-300">Address</Label>
                <Input
                  id="address"
                  {...register("address")}
                  className="bg-slate-950 border-white/10 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Palette className="mr-2 h-5 w-5 text-indigo-400" />
              Branding
            </CardTitle>
            <CardDescription className="text-slate-400">
              Customize how your gym appears in the member app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Gym Logo</Label>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group">
                <div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="h-6 w-6 text-indigo-400" />
                </div>
                <p className="text-sm font-medium text-white mb-1">Click to upload logo</p>
                <p className="text-xs text-slate-500">PNG, JPG up to 2MB</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryColor" className="text-slate-300">Primary Brand Color</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="primaryColor"
                  type="color"
                  {...register("primaryColor")}
                  className="w-24 h-12 p-1 bg-slate-950 border-white/10 rounded cursor-pointer"
                />
                <span className="text-sm text-slate-400">Used for buttons and accents in the member app</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Clock className="mr-2 h-5 w-5 text-indigo-400" />
              Operating Hours
            </CardTitle>
            <CardDescription className="text-slate-400">
              Set the standard opening and closing times.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-medium text-white border-b border-white/10 pb-2">Weekdays (Mon-Fri)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-400">Opening Time</Label>
                    <Input type="time" {...register("weekdayOpen")} className="bg-slate-950 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">Closing Time</Label>
                    <Input type="time" {...register("weekdayClose")} className="bg-slate-950 border-white/10 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-white border-b border-white/10 pb-2">Weekends (Sat-Sun)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-400">Opening Time</Label>
                    <Input type="time" {...register("weekendOpen")} className="bg-slate-950 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">Closing Time</Label>
                    <Input type="time" {...register("weekendClose")} className="bg-slate-950 border-white/10 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
