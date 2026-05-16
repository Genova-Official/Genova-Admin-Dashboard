'use client';

import { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { 
  ChevronLeft, 
  Filter,
  Share2,
  Building2,
  Users2,
  TrendingUp,
  MapPin,
  Calendar,
  ShieldCheck,
  CreditCard,
  Package,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Briefcase,
  Zap,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';

interface BusinessDetail {
  id: number;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  user_status: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  last_login: string;
  locations: {
    id: string;
    location_name: string;
    is_main_location: boolean;
    status: string;
    created_at: string;
  }[];
  staff: {
    id: number;
    email: string;
    name: string;
    user_status: string;
    last_login: string;
  }[];
  stats: {
    sales: {
      total_volume: number;
      total_count: number;
      total_vat: number;
    };
    inventory: {
      total_items: number;
      total_value: number;
      unique_products: number;
    };
  };
}

export default function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<BusinessDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'branches' | 'staff' | 'financials'>('overview');

  useEffect(() => {
    api.get(`/businesses/${id}/`)
      .then(res => setData(res.data))
      .catch(err => console.error('Failed to fetch business details:', err))
      .finally(() => setLoading(false));
  }, [id]);

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
      <p className="text-secondary text-sm font-bold animate-pulse uppercase tracking-widest">Querying Operational Data...</p>
    </div>
  );

  if (!data) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
      <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-secondary/20">
        <Building2 size={40} />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-black text-foreground uppercase tracking-widest">Entity Not Found</h2>
        <p className="text-secondary text-sm mt-2">The requested business could not be located in the registry.</p>
      </div>
      <Link href="/dashboard/businesses" className="premium-button">
        <ChevronLeft size={16} /> Return to Directory
      </Link>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Top Navigation & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/businesses" className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-secondary hover:text-primary transition-all">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-foreground tracking-tight">{data.name}</h1>
              <span className={`premium-status ${data.user_status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                {data.user_status.toUpperCase()}
              </span>
            </div>
            <p className="text-secondary font-medium text-sm mt-1 flex items-center gap-2">
              <ShieldCheck size={14} className={data.is_verified ? 'text-green-500' : 'text-secondary/40'} />
              {data.email} • ID: GEN-{data.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-accent/50 border border-border rounded-xl text-xs font-bold text-secondary hover:text-foreground transition-all">
            <Activity size={14} /> View Live Metrics
          </button>
          <button className="premium-button">
            <Zap size={14} /> Operational Support
          </button>
        </div>
      </div>

      {/* Strategic Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Financial Strength Card */}
        <div className="lg:col-span-2 premium-card p-8 bg-primary text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 -mr-16 -mt-16 rounded-full bg-white/5 blur-3xl group-hover:bg-white/10 transition-colors"></div>
          <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Sales Volume</p>
                <h2 className="text-5xl font-black tracking-tight">{formatCurrency(data.stats.sales.total_volume)}</h2>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              <div>
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">VAT Generated</p>
                <p className="text-lg font-bold">{formatCurrency(data.stats.sales.total_vat)}</p>
              </div>
              <div>
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">Total Orders</p>
                <p className="text-lg font-bold">{data.stats.sales.total_count.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">Avg Order Value</p>
                <p className="text-lg font-bold">{formatCurrency(data.stats.sales.total_volume / (data.stats.sales.total_count || 1))}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business DNA Card */}
        <div className="premium-card p-8 flex flex-col justify-between space-y-8">
          <div>
            <p className="text-secondary/50 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Entity Metadata</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-secondary">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-secondary/40 uppercase">Joined Platform</p>
                  <p className="text-xs font-bold text-foreground">{new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-secondary">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-secondary/40 uppercase">Last Synchronization</p>
                  <p className="text-xs font-bold text-foreground">{data.last_login ? new Date(data.last_login).toLocaleString() : 'Never'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-secondary">
                  <Briefcase size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-secondary/40 uppercase">Business Class</p>
                  <p className="text-xs font-bold text-foreground">Multi-Location Enterprise</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex items-center justify-between">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-accent flex items-center justify-center text-[10px] font-bold">
                  {data.staff[i]?.name.charAt(0) || '+'}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-background bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                +{data.staff.length}
              </div>
            </div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Active Staff Force</span>
          </div>
        </div>
      </div>

      {/* Tabs System */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border">
          <div className="flex gap-8">
            {['overview', 'branches', 'staff', 'financials'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                  activeTab === tab ? 'text-primary' : 'text-secondary hover:text-foreground'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 mb-4">
            <button className="p-2 rounded-xl bg-accent text-secondary hover:text-primary transition-all">
              <Share2 size={18} />
            </button>
            <button className="p-2 rounded-xl bg-accent text-secondary hover:text-primary transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <OverviewInsightCard 
                label="Inventory Portfolio" 
                title={`${data.stats.inventory.total_items.toLocaleString()} Total Items`}
                subTitle={`${data.stats.inventory.unique_products} Unique Product Lines`}
                value={formatCurrency(data.stats.inventory.total_value)}
                icon={Package}
                color="blue"
              />
              <OverviewInsightCard 
                label="Infrastructure Scale" 
                title={`${data.locations.length} Active Branches`}
                subTitle={`${data.staff.length} Total Registered Staff`}
                value="Enterprise Grade"
                icon={MapPin}
                color="purple"
              />
              <OverviewInsightCard 
                label="Transaction Velocity" 
                title={`${data.stats.sales.total_count.toLocaleString()} Successful Sales`}
                subTitle="100% Platform Uptime"
                value={formatCurrency(data.stats.sales.total_volume / (data.stats.sales.total_count || 1))}
                icon={CreditCard}
                color="green"
              />
            </motion.div>
          )}

          {activeTab === 'branches' && (
            <motion.div 
              key="branches"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="premium-card overflow-hidden"
            >
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Branch Location</th>
                    <th>Status</th>
                    <th>Onboarding Date</th>
                    <th>Type</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.locations.map((loc) => (
                    <tr key={loc.id} className="hover:bg-accent/30 transition-colors">
                      <td className="font-bold text-foreground">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${loc.is_main_location ? 'bg-primary/10 text-primary' : 'bg-accent text-secondary'}`}>
                            <MapPin size={14} />
                          </div>
                          <span>{loc.location_name} {loc.is_main_location && <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-2">MAIN</span>}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`premium-status ${loc.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                          {loc.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-secondary text-xs font-medium">{new Date(loc.created_at).toLocaleDateString()}</td>
                      <td className="text-secondary/50 text-[10px] font-black uppercase tracking-widest">{loc.is_main_location ? 'Operational HQ' : 'Satellite Branch'}</td>
                      <td className="text-right">
                        <button className="p-2 text-secondary hover:text-primary transition-all">
                          <ArrowUpRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'staff' && (
            <motion.div 
              key="staff"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="premium-card overflow-hidden"
            >
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>System Role</th>
                    <th>Account Status</th>
                    <th>Last Activity</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.staff.map((s) => (
                    <tr key={s.id} className="hover:bg-accent/30 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center font-black text-xs text-secondary">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">{s.name}</p>
                            <p className="text-[10px] text-secondary/60">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Operational User</span>
                      </td>
                      <td>
                        <span className={`premium-status ${s.user_status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                          {s.user_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-secondary text-xs font-medium">{s.last_login ? new Date(s.last_login).toLocaleString() : 'Never'}</td>
                      <td className="text-right">
                         <button className="p-2 text-secondary hover:text-primary transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function OverviewInsightCard({ label, title, subTitle, value, icon: Icon, color }: any) {
  return (
    <div className="premium-card p-8 flex flex-col gap-6 group hover:border-primary/20 transition-all">
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${
          color === 'blue' ? 'bg-blue-500/10 text-blue-600' :
          color === 'purple' ? 'bg-purple-500/10 text-purple-600' :
          'bg-green-500/10 text-green-600'
        }`}>
          <Icon size={24} />
        </div>
        <span className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div>
        <h4 className="text-lg font-black text-foreground tracking-tight">{title}</h4>
        <p className="text-xs text-secondary font-medium mt-1">{subTitle}</p>
      </div>
      <div className="pt-4 border-t border-border mt-auto flex items-center justify-between">
        <span className="text-xl font-black text-foreground tracking-tight">{value}</span>
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-secondary group-hover:text-primary group-hover:bg-primary/5 transition-all">
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
}
