'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search, Bell, ChevronRight, LogOut, Settings, User } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { getInitials } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const breadcrumbLabels: Record<string, string> = {
  gym: 'Gym',
  admin: 'Admin',
  trainer: 'Trainer',
  member: 'Member',
  members: 'Members',
  plans: 'Plans',
  classes: 'Classes',
  trainers: 'Trainers',
  settings: 'Settings',
  workouts: 'Workouts',
  sessions: 'Sessions',
  progress: 'Progress',
  profile: 'Profile',
  tenants: 'Tenants',
  create: 'Create',
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { setMobileMenuOpen } = useUIStore();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => ({
      label: breadcrumbLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href: '/' + segments.slice(0, index + 1).join('/'),
      isLast: index === segments.length - 1,
    }));
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-6 bg-slate-950/80 backdrop-blur-sm border-b border-white/5">
      {/* Left: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="hidden sm:flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <div key={crumb.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
              <span
                className={
                  crumb.isLast
                    ? 'text-slate-200 font-medium'
                    : 'text-slate-500 hover:text-slate-300 cursor-pointer transition-colors'
                }
                onClick={() => {
                  if (!crumb.isLast) router.push(crumb.href);
                }}
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* Right: Search, Notifications, User */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 rounded-lg bg-white/5 border border-white/5 px-3 py-1.5 text-sm text-slate-400 hover:border-white/10 transition-colors">
          <Search className="w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-40 placeholder-slate-500 text-slate-200"
          />
          <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-500">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
        </button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-white/5 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                {user ? getInitials(`${user.firstName} ${user.lastName}`) : 'U'}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-slate-200">
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onClick={() => router.push(user?.role === 'MEMBER' ? '/member/profile' : '/gym/settings')}
              className="text-slate-300 hover:text-slate-100 focus:bg-white/5 cursor-pointer"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(user?.role === 'MEMBER' ? '/member/profile' : '/gym/settings')}
              className="text-slate-300 hover:text-slate-100 focus:bg-white/5 cursor-pointer"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 focus:bg-red-500/10 cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
