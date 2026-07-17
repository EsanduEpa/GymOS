'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell,
  LayoutDashboard,
  Users,
  CreditCard,
  Calendar,
  UserCog,
  Settings,
  ClipboardList,
  TrendingUp,
  User,
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { cn, getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navByRole: Record<string, NavItem[]> = {
  GYM_OWNER: [
    { label: 'Dashboard', href: '/gym', icon: LayoutDashboard },
    { label: 'Members', href: '/gym/members', icon: Users },
    { label: 'Plans', href: '/gym/plans', icon: CreditCard },
    { label: 'Classes', href: '/gym/classes', icon: Calendar },
    { label: 'Trainers', href: '/gym/trainers', icon: UserCog },
    { label: 'Settings', href: '/gym/settings', icon: Settings },
  ],
  GYM_ADMIN: [
    { label: 'Dashboard', href: '/gym', icon: LayoutDashboard },
    { label: 'Members', href: '/gym/members', icon: Users },
    { label: 'Plans', href: '/gym/plans', icon: CreditCard },
    { label: 'Classes', href: '/gym/classes', icon: Calendar },
    { label: 'Trainers', href: '/gym/trainers', icon: UserCog },
    { label: 'Settings', href: '/gym/settings', icon: Settings },
  ],
  TRAINER: [
    { label: 'Dashboard', href: '/trainer', icon: LayoutDashboard },
    { label: 'Workouts', href: '/trainer/workouts', icon: Dumbbell },
    { label: 'Sessions', href: '/trainer/sessions', icon: ClipboardList },
    { label: 'My Classes', href: '/trainer/classes', icon: Calendar },
  ],
  MEMBER: [
    { label: 'Dashboard', href: '/member', icon: LayoutDashboard },
    { label: 'Classes', href: '/member/classes', icon: Calendar },
    { label: 'Workouts', href: '/member/workouts', icon: Dumbbell },
    { label: 'Progress', href: '/member/progress', icon: TrendingUp },
    { label: 'Profile', href: '/member/profile', icon: User },
  ],
  SUPER_ADMIN: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Tenants', href: '/admin/tenants', icon: Building2 },
  ],
};

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'SUPER_ADMIN': return 'Super Admin';
    case 'GYM_OWNER': return 'Gym Owner';
    case 'GYM_ADMIN': return 'Gym Admin';
    case 'TRAINER': return 'Trainer';
    case 'MEMBER': return 'Member';
    default: return role;
  }
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebarCollapsed, mobileMenuOpen, setMobileMenuOpen } = useUIStore();

  const role = user?.role || 'MEMBER';
  const navItems = navByRole[role] || navByRole.MEMBER;

  const isActive = (href: string) => {
    if (href === '/gym' || href === '/trainer' || href === '/member' || href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20 shrink-0">
          <Dumbbell className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <span className="text-xl font-bold gradient-text-brand whitespace-nowrap">
                GymOS
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="ml-auto lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-gradient-to-r from-indigo-500/15 to-violet-500/10 text-white border border-indigo-500/20 shadow-sm'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
                sidebarCollapsed && 'justify-center px-2'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-colors',
                  active
                    ? 'text-indigo-400'
                    : 'text-slate-500 group-hover:text-slate-300'
                )}
              />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle (desktop only) */}
      <div className="hidden lg:flex justify-end px-3 py-2 border-t border-white/5">
        <button
          onClick={toggleSidebarCollapsed}
          className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* User Section */}
      <div className="border-t border-white/5 p-3">
        <div
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-2.5',
            sidebarCollapsed && 'justify-center px-2'
          )}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user ? getInitials(`${user.firstName} ${user.lastName}`) : 'U'}
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-hidden min-w-0"
              >
                <p className="text-sm font-medium text-slate-200 truncate">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 border-indigo-500/30 text-indigo-400 mt-0.5"
                >
                  {getRoleLabel(role as UserRole)}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleLogout}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors shrink-0"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'hidden lg:flex flex-col h-screen shrink-0',
          'bg-slate-900/60 backdrop-blur-xl border-r border-white/5'
        )}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                'fixed top-0 left-0 z-50 flex flex-col h-screen w-64',
                'bg-slate-900/95 backdrop-blur-xl border-r border-white/5 lg:hidden'
              )}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
