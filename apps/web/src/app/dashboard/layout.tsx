'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  Search, 
  LogOut,
  UserCheck,
  Activity,
  Cpu,
  Store,
  LineChart,
  Terminal,
  Bell,
  Command,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const NAV_GROUPS = [
  {
    label: 'INTELLIGENCE',
    items: [
      { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
      { icon: LineChart, label: 'Analytics', href: '/dashboard/analytics' },
      { icon: Zap, label: 'Real-time Feed', href: '/dashboard/activity' },
    ]
  },
  {
    label: 'OPERATIONS',
    items: [
      { icon: Store, label: 'Businesses', href: '/dashboard/businesses' },
      { icon: Activity, label: 'Branch Monitor', href: '/dashboard/branches' },
      { icon: UserCheck, label: 'Staff Directory', href: '/dashboard/staff' },
    ]
  },
  {
    label: 'INFRASTRUCTURE',
    items: [
      { icon: ShieldCheck, label: 'Access Control', href: '/dashboard/security' },
      { icon: Cpu, label: 'System Health', href: '/dashboard/health' },
      { icon: Terminal, label: 'Debug Logs', href: '/dashboard/logs' },
    ]
  }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    if (!useAuthStore.getState().token) {
      router.push('/login');
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary selection:text-white">
      {/* Strategic Header */}
      <header className="h-16 glass border-b border-border flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-12 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <Command size={20} weight="bold" />
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-black text-lg tracking-tight leading-none">GENOVA</span>
              <span className="text-secondary font-medium text-[10px] tracking-[0.2em] uppercase leading-none mt-1">Console</span>
            </div>
          </Link>
          
          <div className={`max-w-xl w-full relative transition-all duration-300 ${isSearchFocused ? 'max-w-2xl' : ''}`}>
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isSearchFocused ? 'text-primary' : 'text-secondary'}`} />
            <input 
              type="text" 
              placeholder="Command + K to search businesses, transactions..."
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-12 pr-4 py-2 bg-accent/50 border border-border rounded-xl text-sm focus:bg-background focus:ring-4 focus:ring-ring outline-none transition-all placeholder:text-secondary/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/50 rounded-full border border-border">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Mainnet Live</span>
          </div>

          <button className="relative p-2 text-secondary hover:text-primary transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
          </button>
          
          <div className="h-6 w-px bg-border"></div>

          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end">
                <p className="text-xs font-bold text-foreground">{user.email.split('@')[0]}</p>
                <p className="text-[9px] text-secondary font-medium uppercase tracking-wider">Super Admin</p>
             </div>
             <div className="w-10 h-10 rounded-xl border border-border p-0.5 group cursor-pointer hover:border-primary transition-colors">
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}&backgroundColor=610B63&fontFamily=Outfit&fontWeight=700`} 
                  alt="Avatar" 
                  className="w-full h-full rounded-[10px] object-cover"
                />
             </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Command Sidebar */}
        <aside className="w-72 bg-sidebar border-r border-border flex flex-col h-[calc(100vh-64px)]">
          <nav className="flex-1 py-8 px-6 overflow-y-auto space-y-10 custom-scrollbar">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="space-y-3">
                <p className="px-3 text-[10px] font-black text-secondary/40 tracking-[0.2em] uppercase">{group.label}</p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          isActive 
                            ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                            : 'text-secondary hover:text-foreground hover:bg-accent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className={isActive ? 'text-white' : 'text-secondary group-hover:text-primary transition-colors'} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <motion.div layoutId="active-nav" className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-6 border-t border-border mt-auto">
            <button 
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-3 text-secondary font-bold text-sm hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all rounded-xl group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Terminate Session</span>
            </button>
          </div>
        </aside>

        {/* Operational Main Content */}
        <main className="flex-1 overflow-y-auto bg-accent/20 custom-scrollbar relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
          <div className="p-8 lg:p-12 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
