'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { 
  Users, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Filter,
  Activity,
  Globe,
  Zap,
  Package,
  AlertTriangle,
  TrendingUp,
  Store,
  ChevronRight,
  RefreshCcw,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  businesses: { total: number; active: number; inactive: number };
  staff: { total: number };
  branches: { total: number };
  sales: { 
    total_volume: number; 
    total_vat: number; 
    transactions_today: number; 
    transactions_week: number; 
    transactions_month: number; 
  };
  inventory: { 
    total_count: number; 
    total_value: number; 
    total_products: number; 
    low_stock_alerts: number; 
  };
}

export default function OverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, feedRes] = await Promise.all([
        api.get('/stats/global/'),
        api.get('/activity/')
      ]);
      setStats(statsRes.data);
      setFeed(feedRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds for "Real-time" feel
    const interval = setInterval(() => {
      setRefreshing(true);
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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
      <p className="text-secondary text-sm font-bold animate-pulse uppercase tracking-widest">Synchronizing Intelligence...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Command Center</h1>
          <div className="text-secondary font-semibold text-sm uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <Globe size={14} className="text-primary" /> Global Platform Oversight
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/50 border border-border transition-opacity duration-300 ${refreshing ? 'opacity-100' : 'opacity-0'}`}>
              <RefreshCcw size={14} className="text-primary animate-spin" />
              <span className="text-[10px] font-bold text-secondary uppercase">Updating Feed</span>
           </div>
           <div className="flex flex-col items-end px-4 border-r border-border">
              <span className="text-[10px] font-black text-secondary/50 uppercase tracking-widest">Platform Status</span>
              <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
                 <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                 OPERATIONAL
              </div>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-secondary/50 uppercase tracking-widest">Sync Latency</span>
              <span className="text-foreground font-bold text-sm">24ms</span>
           </div>
        </div>
      </div>

      {/* High-Level Pulse Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Business Value" 
          value={formatCurrency(stats?.sales.total_volume || 0)} 
          trend="+12.5% vs last month"
          icon={TrendingUp}
          color="purple"
        />
        <StatCard 
          label="Total Inventory Assets" 
          value={formatCurrency(stats?.inventory.total_value || 0)} 
          trend={`${stats?.inventory.total_count.toLocaleString()} items`}
          icon={Package}
          color="blue"
        />
        <StatCard 
          label="Active Businesses" 
          value={stats?.businesses.active || 0} 
          trend={`${stats?.businesses.total} total onboarded`}
          icon={Store}
          color="green"
        />
        <StatCard 
          label="Stock Alerts" 
          value={stats?.inventory.low_stock_alerts || 0} 
          trend="Critical attention needed"
          icon={AlertTriangle}
          color="orange"
          isAlert={!!stats?.inventory.low_stock_alerts}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Intelligence Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="text-primary" size={20} />
              <h2 className="text-xl font-bold text-foreground">Operational Pulse</h2>
            </div>
            <Link href="/dashboard/activity" className="text-primary text-xs font-bold hover:underline flex items-center gap-1 group">
              VIEW LIVE STREAM <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="premium-card overflow-hidden">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Entity</th>
                  <th>Activity</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {feed.slice(0, 8).map((item, i) => (
                  <tr key={item.id} className="group cursor-pointer hover:bg-accent/30 transition-colors">
                    <td className="text-secondary/50 font-mono text-xs">{String(i + 1).padStart(2, '0')}</td>
                    <td className="font-bold text-foreground group-hover:text-primary transition-colors">{item.business_name}</td>
                    <td className="text-secondary text-xs">{item.description}</td>
                    <td className="font-mono font-bold text-foreground">
                      {item.amount ? formatCurrency(item.amount) : '---'}
                    </td>
                    <td>
                      <span className={`premium-status ${
                        item.status === 'Paid' || item.status === 'Active' 
                          ? 'status-active' 
                          : item.status === 'Pending' 
                            ? 'status-pending' 
                            : 'status-inactive'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="text-secondary/60 text-[10px] font-medium flex items-center gap-1.5">
                      <Clock size={10} /> {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tactical Metrics Sidebar */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
              <Zap className="text-primary" size={20} />
              <h2 className="text-xl font-bold text-foreground">Tactical Overview</h2>
            </div>

            <div className="space-y-4">
              <TacticalMetric 
                label="Transactions Today" 
                value={stats?.sales.transactions_today || 0} 
                subValue={`${stats?.sales.transactions_week || 0} this week`}
              />
              <TacticalMetric 
                label="Total VAT Generated" 
                value={formatCurrency(stats?.sales.total_vat || 0)} 
                subValue="Platform-wide collection"
              />
              <TacticalMetric 
                label="Global Staff Force" 
                value={stats?.staff.total || 0} 
                subValue="Across all locations"
              />
              <TacticalMetric 
                label="Total Locations" 
                value={stats?.branches.total || 0} 
                subValue="Active branches"
              />
            </div>

            {/* Platform Health Quick View */}
            <div className="premium-card p-6 bg-primary/[0.02] border-primary/10">
               <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Infrastructure Health</h3>
               <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-secondary">Database API</span>
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">HEALTHY</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-secondary">Sync Gateway</span>
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">HEALTHY</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-secondary">Worker Cluster</span>
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">HEALTHY</span>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, color, isAlert }: any) {
  return (
    <div className={`premium-card p-6 flex flex-col gap-4 relative overflow-hidden group ${isAlert ? 'border-orange-500/50 bg-orange-500/[0.02]' : ''}`}>
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-${color}-500/5 blur-2xl group-hover:bg-${color}-500/10 transition-colors`}></div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${
        color === 'purple' ? 'bg-purple-500/10 text-purple-600' :
        color === 'blue' ? 'bg-blue-500/10 text-blue-600' :
        color === 'green' ? 'bg-green-500/10 text-green-600' :
        'bg-orange-500/10 text-orange-600'
      }`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-secondary/60 font-bold text-xs uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-3xl font-black text-foreground tracking-tight">{value}</h3>
        <p className={`text-[10px] font-bold mt-2 ${isAlert ? 'text-orange-500' : 'text-secondary/40'}`}>{trend}</p>
      </div>
    </div>
  );
}

function TacticalMetric({ label, value, subValue }: any) {
  return (
    <div className="premium-card p-5 bg-background/50 border-border/50 hover:border-primary/20 transition-all">
       <div className="flex justify-between items-start">
          <div className="space-y-1">
             <p className="text-[10px] font-bold text-secondary/50 uppercase tracking-widest">{label}</p>
             <h4 className="text-xl font-black text-foreground tracking-tight">{value}</h4>
             <p className="text-[10px] font-medium text-secondary/40 italic">{subValue}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-secondary">
             <ChevronRight size={14} />
          </div>
       </div>
    </div>
  );
}
