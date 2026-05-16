'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { 
  Activity, 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  MapPin, 
  User, 
  CreditCard, 
  ArrowRight,
  Package,
  CheckCircle2,
  AlertCircle,
  Building2
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'sale' | 'onboarding' | 'system';
  description: string;
  business_name: string;
  location_name?: string;
  initiated_by?: string;
  amount?: number;
  item_count?: number;
  timestamp: string;
  status: string;
}

export default function ActivityMonitorPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, []);

  const fetchActivity = async () => {
    try {
      const res = await api.get('/activity/');
      setActivities(res.data);
    } catch (err) {
      console.error('Failed to fetch activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(val).replace('NGN', '₦');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-secondary text-sm font-bold animate-pulse uppercase tracking-widest text-center">
        Opening Telemetry Stream...
      </p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Activity Monitor</h1>
          <div className="text-secondary font-semibold text-sm uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(97,11,99,0.5)]"></div>
            Live Operational Stream
          </div>
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

      <div className="space-y-4 relative">
        {/* Connection Line */}
        <div className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-border to-transparent hidden md:block"></div>

        <AnimatePresence initial={false}>
          {activities.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="relative pl-0 md:pl-20 group"
            >
              {/* Timeline Dot */}
              <div className="absolute left-[34px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background bg-border group-hover:bg-primary group-hover:border-primary/30 transition-all duration-300 hidden md:block z-10"></div>

              <div className="premium-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-xl hover:shadow-primary/5 transition-all">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                    item.type === 'sale' 
                    ? 'bg-green-500/5 border-green-500/10 text-green-600' 
                    : 'bg-primary/5 border-primary/10 text-primary'
                  }`}>
                    {item.type === 'sale' ? <TrendingUp size={24} /> : <Building2 size={24} />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-lg text-foreground tracking-tight">{item.business_name}</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-secondary/40 px-2 py-0.5 border border-border rounded-md bg-accent/30">
                        {item.type === 'sale' ? 'Sale Event' : 'Onboarding'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-secondary">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-secondary/30" />
                        {item.location_name || 'Global HQ'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-secondary/30" />
                        {item.initiated_by || 'System'}
                      </div>
                      {item.item_count && (
                        <div className="flex items-center gap-1.5">
                          <Package size={14} className="text-secondary/30" />
                          {item.item_count} items
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 lg:gap-1.5 pr-4 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-8">
                   {item.amount && (
                      <p className="text-xl font-black text-foreground">{formatCurrency(item.amount)}</p>
                   )}
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-secondary/40 uppercase tracking-widest">
                        <Clock size={12} />
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                        item.status.toLowerCase() === 'paid' || item.status.toLowerCase() === 'active'
                        ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}>
                        {item.status.toLowerCase() === 'paid' && <CheckCircle2 size={10} />}
                        {item.status}
                      </div>
                   </div>
                </div>

                <button className="hidden lg:flex p-2 text-secondary hover:text-primary transition-colors">
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
