"use client";

import { motion } from "framer-motion";
import { Check, Edit, Plus, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mockPlans = [
  {
    id: "1",
    name: "Basic",
    price: "LKR 3,500",
    duration: "Monthly",
    activeMembers: 124,
    popular: false,
    features: [
      "Access to gym equipment",
      "Locker room access",
      "Free initial assessment",
    ],
  },
  {
    id: "2",
    name: "Pro",
    price: "LKR 5,000",
    duration: "Monthly",
    activeMembers: 356,
    popular: true,
    features: [
      "Everything in Basic",
      "Unlimited group classes",
      "1 PT session per month",
      "Towel service",
    ],
  },
  {
    id: "3",
    name: "Annual Premium",
    price: "LKR 50,000",
    duration: "Yearly",
    activeMembers: 89,
    popular: false,
    features: [
      "Everything in Pro",
      "2 months free",
      "Priority class booking",
      "Guest passes (2/month)",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PlansPage() {
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
            Membership Plans
          </h1>
          <p className="text-slate-400 mt-1">
            Manage your gym's pricing and subscription tiers.
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-slate-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Create New Plan</DialogTitle>
              <DialogDescription className="text-slate-400">
                Add a new membership tier to your offerings.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-slate-300">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Platinum"
                  className="col-span-3 bg-slate-950 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right text-slate-300">
                  Price (LKR)
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  className="col-span-3 bg-slate-950 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right text-slate-300">
                  Duration
                </Label>
                <Input
                  id="duration"
                  placeholder="e.g. Monthly"
                  className="col-span-3 bg-slate-950 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Save Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPlans.map((plan) => (
          <motion.div key={plan.id} variants={itemVariants}>
            <Card
              className={`relative h-full flex flex-col bg-slate-900/40 backdrop-blur-xl border-white/10 ${
                plan.popular ? "ring-2 ring-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full text-xs font-semibold text-white flex items-center gap-1 shadow-lg">
                  <Star className="h-3 w-3 fill-current" />
                  Most Popular
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-white">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-slate-400 mt-1">
                      {plan.duration}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {plan.activeMembers}
                  </Badge>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-slate-400 text-sm">
                    /{plan.duration.toLowerCase().replace("ly", "")}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                      <div className="rounded-full bg-emerald-500/20 p-0.5 mt-0.5 shrink-0">
                        <Check className="h-3 w-3 text-emerald-400" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex gap-3 pt-6 border-t border-white/5 mt-auto">
                <Button className="flex-1 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:text-white">
                  Deactivate
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
