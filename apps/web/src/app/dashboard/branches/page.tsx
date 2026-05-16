'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { 
  MapPin, 
  Search, 
  Filter, 
  Activity, 
  LayoutGrid, 
  List,
  Building,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  Clock,
  Navigation
} from 'lucide-react';

interface Branch {
  id: number;
  location_name: string;
  address: string;
  status: string;
  is_main_location: boolean;
  created_at: string;
  business_admin_email: string;
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      // We'll need a backend endpoint for this or aggregate from businesses
      // For now, let's assume we have /branches/ or similar under console
      const res = await api.get('/branches/');
      setBranches(res.data);
    } catch (err) {
      console.error('Failed to fetch branches:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Branch Infrastructure</h1>
          <p className="text-secondary font-medium text-sm mt-1">Monitoring across {branches.length} physical points of presence</p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-accent/50 rounded-xl border border-border">
          <button 
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-secondary hover:text-foreground'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm text-primary' : 'text-secondary hover:text-foreground'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
          <input 
            type="text" 
            placeholder="Locate branch by name, address or region..."
            className="command-input pl-12"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-accent/50 border border-border rounded-xl text-sm font-bold text-secondary">
          <Filter size={16} /> Regional Filter
        </button>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-secondary uppercase tracking-widest">Triangulating Locations...</p>
        </div>
      ) : (
        <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {branches.map((branch) => (
            <motion.div 
              key={branch.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="premium-card p-6 group cursor-pointer relative overflow-hidden"
            >
              {branch.is_main_location && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg">
                  HQ
                </div>
              )}
              
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Building size={24} />
                </div>
                <div className={`premium-status ${branch.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                  {branch.status}
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="font-black text-xl text-foreground group-hover:text-primary transition-colors">{branch.location_name}</h3>
                <div className="flex items-center gap-2 text-secondary text-sm">
                  <MapPin size={14} className="text-secondary/40" />
                  <span className="truncate">{branch.address || 'Standard Operational Zone'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Affiliation</p>
                  <p className="text-xs font-bold text-foreground truncate">{branch.business_admin_email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Telemetry</p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-green-500">
                    <TrendingUp size={12} />
                    Active
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-bold text-secondary group-hover:text-primary transition-colors">
                <div className="flex items-center gap-2">
                   <Clock size={14} /> 
                   <span>Added {new Date(branch.created_at).toLocaleDateString()}</span>
                </div>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
