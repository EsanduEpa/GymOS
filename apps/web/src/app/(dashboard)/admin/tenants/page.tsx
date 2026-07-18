"use client";

import { motion } from "framer-motion";
import { Building2, Plus, Search, MoreHorizontal, Eye, Ban, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockTenants = [
  { id: "GYM-001", name: "Iron Forge Fitness", owner: "Alex Johnson", email: "alex@ironforge.com", plan: "Enterprise", members: 1245, status: "Active", created: "2023-01-15" },
  { id: "GYM-002", name: "Apex Athletics", owner: "Sarah Connor", email: "sarah@apex.com", plan: "Pro", members: 450, status: "Active", created: "2023-03-22" },
  { id: "GYM-003", name: "Zen Yoga Studio", owner: "Mike Tyson", email: "mike@zenyoga.com", plan: "Basic", members: 120, status: "Active", created: "2023-05-10" },
  { id: "GYM-004", name: "CrossFit Central", owner: "Emma Watson", email: "emma@cfcentral.com", plan: "Pro", members: 890, status: "Suspended", created: "2023-02-05" },
  { id: "GYM-005", name: "Lift & Tone", owner: "David Smith", email: "david@liftandtone.com", plan: "Basic", members: 65, status: "Active", created: "2023-08-14" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function TenantsPage() {
  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
      : "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const getPlanColor = (plan: string) => {
    switch(plan) {
      case "Enterprise": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Pro": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="h-8 w-8 text-indigo-400" />
            Tenants (Gyms)
          </h1>
          <p className="text-slate-400 mt-1">Manage all gym instances on the platform.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="h-4 w-4 mr-2" /> Onboard New Gym
        </Button>
      </div>

      <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Search by gym name or owner email..." 
              className="bg-slate-950 border-white/10 text-white pl-10"
            />
          </div>
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
            Filter
          </Button>
        </div>

        <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-950/50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-black/40 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-semibold">Gym Name</th>
                  <th className="px-6 py-4 font-semibold">Owner</th>
                  <th className="px-6 py-4 font-semibold">Plan</th>
                  <th className="px-6 py-4 font-semibold text-right">Members</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Created Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockTenants.map((tenant, i) => (
                  <tr key={tenant.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-0">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{tenant.name}</div>
                      <div className="text-xs text-slate-500">{tenant.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300">{tenant.owner}</div>
                      <div className="text-xs text-slate-500">{tenant.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={getPlanColor(tenant.plan)}>
                        {tenant.plan}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-300">
                      {tenant.members.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={getStatusColor(tenant.status)}>
                        {tenant.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {tenant.created}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                          <DropdownMenuLabel className="text-slate-400">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" /> View Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 cursor-pointer">
                            <Ban className="h-4 w-4 mr-2" /> Suspend Tenant
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
