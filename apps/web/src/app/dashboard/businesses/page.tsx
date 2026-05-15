'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { 
  Search, 
  Filter, 
  Share2, 
  MoreHorizontal, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Building2,
  Users2,
  TrendingUp,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

interface Business {
  id: number;
  email: string;
  name: string;
  status: string;
  is_verified: boolean;
  created_at: string;
  location_count: number;
  staff_count: number;
  total_sales_volume: number;
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchBusinesses();
  }, [search, page]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/businesses/?search=${search}&page=${page}`);
      setBusinesses(res.data.results);
      setTotalCount(res.data.count);
    } catch (err) {
      console.error('Failed to fetch businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(val || 0).replace('NGN', '₦');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Platform Businesses</h1>
          <p className="text-secondary font-medium text-sm mt-1">Managing {totalCount} corporate entities on the platform</p>
        </div>

        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-secondary hover:text-primary hover:border-primary transition-all">
              <Download size={14} /> Export CSV
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              <Share2 size={14} /> Distribute Report
           </button>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
          <input 
            type="text" 
            placeholder="Search by business name, email, or lookup ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="command-input pl-12"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-accent/50 border border-border rounded-xl text-sm font-bold text-secondary">
          <Filter size={16} /> Advanced Filters
        </button>
      </div>

      {/* Businesses Table */}
      <div className="premium-card overflow-hidden">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Business Entity</th>
              <th>Infrastructure</th>
              <th>Operational Status</th>
              <th>Financial Volume</th>
              <th>Onboarding</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.tr 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={6} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-bold text-secondary uppercase tracking-[0.2em]">Querying Registry...</p>
                    </div>
                  </td>
                </motion.tr>
              ) : businesses.length === 0 ? (
                <motion.tr 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={6} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-3 text-secondary/40">
                      <Building2 size={48} strokeWidth={1} />
                      <p className="font-bold uppercase tracking-widest text-sm">No Matching Entities Found</p>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                businesses.map((biz) => (
                  <motion.tr 
                    key={biz.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group hover:bg-accent/30 transition-colors cursor-pointer"
                  >
                    <td className="py-5">
                      <Link href={`/dashboard/businesses/${biz.id}`} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-foreground group-hover:text-primary transition-colors">{biz.name}</p>
                          <p className="text-[10px] font-medium text-secondary/60 uppercase tracking-tighter">{biz.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground/80">
                          <MapPin size={12} className="text-secondary/40" />
                          <span>{biz.location_count} Branches</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground/80">
                          <Users2 size={12} className="text-secondary/40" />
                          <span>{biz.staff_count} Staff Members</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`premium-status ${
                        biz.status === 'Active' ? 'status-active' : 'status-inactive'
                      }`}>
                        {biz.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-foreground font-black text-sm">
                        <TrendingUp size={14} className="text-green-500" />
                        {formatCurrency(biz.total_sales_volume)}
                      </div>
                    </td>
                    <td>
                      <div className="text-secondary text-[10px] font-bold">
                        {new Date(biz.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: '2-digit' 
                        })}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/dashboard/businesses/${biz.id}`}
                          className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-primary/5 transition-all"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <button className="p-2 rounded-lg text-secondary hover:text-foreground hover:bg-accent transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Premium Pagination */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs font-bold text-secondary/60">
          Showing <span className="text-foreground">{(page - 1) * 20 + 1}-{Math.min(page * 20, totalCount)}</span> of <span className="text-foreground">{totalCount}</span> businesses
        </p>
        
        <div className="flex items-center gap-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-2 rounded-lg border border-border text-secondary hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          {[...Array(Math.ceil(totalCount / 20))].map((_, i) => (
             <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  page === i + 1 ? 'bg-primary text-white' : 'text-secondary hover:bg-accent'
                }`}
             >
                {i + 1}
             </button>
          ))}
          <button 
            disabled={page >= Math.ceil(totalCount / 20)}
            onClick={() => setPage(p => p + 1)}
            className="p-2 rounded-lg border border-border text-secondary hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
