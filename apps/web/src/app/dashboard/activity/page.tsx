'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { 
  Activity, 
  ShoppingBag, 
  UserPlus, 
  AlertCircle,
  Clock,
  ArrowRight,
  Filter,
  RefreshCcw,
  Search,
  Zap,
  ChevronRight,
  TrendingUp,
  MapPin,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function ActivityMonitorPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get('/activity/');
        setActivities(res.data);
      } catch (err) {
        console.error('Failed to fetch activity feed:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchActivity();
    const interval = setInterval(() => {
      setRefreshing(true);
      fetchActivity();
    }, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'sale': return ShoppingBag;
      case 'onboarding': return UserPlus;
      case 'error': return AlertCircle;
      default: return Activity;
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(val || 0).replace('NGN', '₦');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-secondary text-sm font-bold animate-pulse uppercase tracking-widest">Opening Telemetry Stream...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Activity Monitor</h1>
          <p className="text-secondary font-semibold text-sm uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(97,11,99,0.5)]"></div>
            Live Operational Stream
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
            <input 
              type="text" 
              placeholder="Filter live feed..."
              className="command-input pl-10 text-xs py-2 w-64"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-accent border border-border text-secondary hover:text-primary transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="relative">
        <div className="absolute left-10 top-0 bottom-0 w-px bg-border/50"></div>
        
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {activities.map((activity, i) => {
              const Icon = getIcon(activity.type);
              const isNew = i === 0 && refreshing;
              
              return (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative group"
                >
                  <div className="flex items-start gap-8">
                    {/* Icon Column */}
                    <div className="relative z-10 shrink-0 mt-1">
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-300 border shadow-sm ${
                        activity.type === 'sale' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
                        activity.type === 'onboarding' ? 'bg-primary/10 text-primary border-primary/20' :
                        'bg-blue-500/10 text-blue-600 border-blue-500/20'
                      } group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon size={28} />
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 premium-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group-hover:border-primary/20 transition-all">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-black text-foreground text-lg tracking-tight group-hover:text-primary transition-colors">{activity.business_name}</h4>
                          <span className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em]">Platform Entity</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                           <p className="text-secondary text-sm font-medium flex items-center gap-2">
                              <Zap size={14} className="text-primary" /> {activity.description}
                           </p>
                           {activity.amount && (
                              <div className="flex items-center gap-2 text-foreground font-black text-sm">
                                <TrendingUp size={14} className="text-green-500" />
                                {formatCurrency(activity.amount)}
                              </div>
                           )}
                           <div className="flex items-center gap-2 text-secondary/60 text-xs font-bold">
                              <MapPin size={14} className="text-secondary/30" /> Multi-Location Node
                           </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-10">
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1.5 text-secondary/50 text-[10px] font-bold uppercase tracking-widest">
                            <Clock size={12} /> {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </div>
                          <span className={`premium-status ${
                            activity.status === 'Paid' || activity.status === 'Active' 
                              ? 'status-active' 
                              : 'status-inactive'
                          }`}>
                            {activity.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <button className="p-3 rounded-xl bg-accent text-secondary hover:text-primary hover:bg-primary/5 transition-all">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Load More Trigger */}
      <div className="py-12 flex flex-col items-center gap-4">
         <div className="w-12 h-px bg-border"></div>
         <p className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.3em]">End of Live Stream</p>
         <button className="premium-button bg-accent text-secondary hover:text-foreground">
            Load Historical Logs
         </button>
      </div>
    </div>
  );
}
