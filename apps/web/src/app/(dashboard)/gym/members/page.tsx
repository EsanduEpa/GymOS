'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Search, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/utils';

interface MockMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  plan: string;
  status: string;
  joinDate: string;
  [key: string]: unknown;
}

const mockMembers: MockMember[] = [
  { id: '1', firstName: 'Kasun', lastName: 'Perera', email: 'kasun@email.com', avatar: 'KP', plan: 'Premium', status: 'ACTIVE', joinDate: '2025-01-15' },
  { id: '2', firstName: 'Amaya', lastName: 'Silva', email: 'amaya@email.com', avatar: 'AS', plan: 'Starter', status: 'ACTIVE', joinDate: '2025-02-20' },
  { id: '3', firstName: 'Nadeesha', lastName: 'Fernando', email: 'nadeesha@email.com', avatar: 'NF', plan: 'Premium', status: 'ACTIVE', joinDate: '2025-03-10' },
  { id: '4', firstName: 'Dinesh', lastName: 'Jayawardena', email: 'dinesh@email.com', avatar: 'DJ', plan: 'Basic', status: 'EXPIRED', joinDate: '2024-11-05' },
  { id: '5', firstName: 'Sithara', lastName: 'Wickramasinghe', email: 'sithara@email.com', avatar: 'SW', plan: 'Premium', status: 'ACTIVE', joinDate: '2025-04-01' },
  { id: '6', firstName: 'Ravi', lastName: 'Kumara', email: 'ravi@email.com', avatar: 'RK', plan: 'Starter', status: 'ACTIVE', joinDate: '2025-05-12' },
  { id: '7', firstName: 'Tharushi', lastName: 'Bandara', email: 'tharushi@email.com', avatar: 'TB', plan: 'Basic', status: 'CANCELLED', joinDate: '2024-09-18' },
  { id: '8', firstName: 'Nuwan', lastName: 'Gamage', email: 'nuwan@email.com', avatar: 'NG', plan: 'Premium', status: 'ACTIVE', joinDate: '2025-06-03' },
  { id: '9', firstName: 'Ishani', lastName: 'Ratnayake', email: 'ishani@email.com', avatar: 'IR', plan: 'Starter', status: 'ACTIVE', joinDate: '2025-06-20' },
  { id: '10', firstName: 'Chaminda', lastName: 'Wijesuriya', email: 'chaminda@email.com', avatar: 'CW', plan: 'Basic', status: 'EXPIRED', joinDate: '2024-12-01' },
  { id: '11', firstName: 'Dilini', lastName: 'Herath', email: 'dilini@email.com', avatar: 'DH', plan: 'Premium', status: 'ACTIVE', joinDate: '2025-07-01' },
  { id: '12', firstName: 'Mahesh', lastName: 'Abeysekera', email: 'mahesh@email.com', avatar: 'MA', plan: 'Starter', status: 'ACTIVE', joinDate: '2025-04-15' },
];

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ACTIVE: 'default',
  EXPIRED: 'destructive',
  CANCELLED: 'secondary',
  INACTIVE: 'outline',
};

export default function MembersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredMembers = mockMembers.filter((m) => {
    const matchesSearch =
      `${m.firstName} ${m.lastName} ${m.email}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<MockMember>[] = [
    {
      key: 'firstName',
      header: 'Name',
      sortable: true,
      render: (member) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {member.avatar}
          </div>
          <div>
            <p className="font-medium text-slate-200">{member.firstName} {member.lastName}</p>
            <p className="text-xs text-slate-500">{member.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      className: 'hidden md:table-cell',
      render: (member) => <span className="text-slate-400">{member.email}</span>,
    },
    {
      key: 'plan',
      header: 'Plan',
      sortable: true,
      render: (member) => (
        <Badge variant="outline" className="border-indigo-500/30 text-indigo-400">
          {member.plan}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (member) => (
        <Badge variant={statusVariant[member.status] || 'outline'}>
          {member.status}
        </Badge>
      ),
    },
    {
      key: 'joinDate',
      header: 'Join Date',
      sortable: true,
      className: 'hidden lg:table-cell',
      render: (member) => <span className="text-slate-400">{formatDate(member.joinDate)}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-10',
      render: (member) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-900/95 backdrop-blur-xl border border-white/10">
            <DropdownMenuItem
              onClick={() => router.push(`/gym/members/${member.id}`)}
              className="text-slate-300 focus:bg-white/5 cursor-pointer"
            >
              <Eye className="w-4 h-4 mr-2" /> View
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-300 focus:bg-white/5 cursor-pointer">
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 cursor-pointer">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Members</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your gym members and subscriptions</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110 transition-all">
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-white/5 pl-10 pr-4 py-2.5 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg bg-white/5 px-3 py-2.5 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="EXPIRED">Expired</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filteredMembers} pageSize={10} />
    </motion.div>
  );
}
