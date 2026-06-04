'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { 
  TrendingUp, 
  ArrowUpRight,
  Filter,
  Calendar,
  CreditCard,
  Banknote,
  PieChart,
  RefreshCcw
} from 'lucide-react';

export default function RevenueInsightsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stats/global/')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 })
      .format(val || 0)
      .replace('NGN', '₦');

  const summaryCards = [
    {
      label: 'Total Platform Sales',
      value: formatCurrency(stats?.sales?.total_volume || 0),
      icon: Banknote,
      color: 'purple',
    },
    {
      label: 'VAT Generated',
      value: formatCurrency(stats?.sales?.total_vat || 0),
      icon: CreditCard,
      color: 'blue',
    },
    {
      label: 'Avg Sale Value',
      value: stats?.sales?.transactions_month
        ? formatCurrency((stats.sales.total_volume || 0) / (stats.sales.transactions_month || 1))
        : '—',
      icon: TrendingUp,
      color: 'green',
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Revenue Insights</h1>
          <p className="text-secondary font-medium text-sm mt-1 uppercase tracking-[0.2em]">
            Platform Financial Intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-secondary">
            <Calendar size={14} /> Last 30 Days
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-secondary hover:text-primary hover:border-primary transition-all">
            <Filter size={14} /> Deep Filter
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      {loading ? (
        <div className="py-16 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-secondary uppercase tracking-widest">Loading Revenue Data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {summaryCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`premium-card p-8 relative overflow-hidden group`}
              >
                <div className={`absolute top-0 right-0 w-28 h-28 -mr-8 -mt-8 rounded-full blur-2xl transition-colors ${
                  card.color === 'purple' ? 'bg-purple-500/5 group-hover:bg-purple-500/10' :
                  card.color === 'blue' ? 'bg-blue-500/5 group-hover:bg-blue-500/10' :
                  'bg-green-500/5 group-hover:bg-green-500/10'
                }`} />
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                  card.color === 'purple' ? 'bg-purple-500/10 text-purple-600' :
                  card.color === 'blue' ? 'bg-blue-500/10 text-blue-600' :
                  'bg-green-500/10 text-green-600'
                }`}>
                  <card.icon size={22} />
                </div>
                <p className="text-[10px] font-black text-secondary/50 uppercase tracking-[0.2em] mb-2">{card.label}</p>
                <h3 className="text-3xl font-black text-foreground tracking-tight">{card.value}</h3>
                <div className="flex items-center gap-2 text-green-600 font-bold text-xs mt-3">
                  <ArrowUpRight size={14} />
                  <span>Live real-time</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Tier Breakdown */}
            <div className="lg:col-span-2 premium-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-lg font-bold text-foreground">Revenue Contribution by Metric</h4>
                <PieChart className="text-secondary/30" size={20} />
              </div>
              <div className="space-y-7">
                {[
                  {
                    label: 'Total Sales Volume',
                    amount: formatCurrency(stats?.sales?.total_volume || 0),
                    share: 100,
                    color: 'bg-primary',
                  },
                  {
                    label: 'VAT Component',
                    amount: formatCurrency(stats?.sales?.total_vat || 0),
                    share: stats?.sales?.total_volume
                      ? Math.round(((stats.sales.total_vat || 0) / stats.sales.total_volume) * 100)
                      : 0,
                    color: 'bg-purple-400',
                  },
                  {
                    label: 'Avg Daily Volume (30d)',
                    amount: formatCurrency((stats?.sales?.total_volume || 0) / 30),
                    share: 35,
                    color: 'bg-purple-200',
                  },
                ].map((tier, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm font-bold text-foreground">{tier.label}</p>
                        <p className="text-[10px] text-secondary/50 font-bold uppercase tracking-widest mt-0.5">{tier.amount}</p>
                      </div>
                      <span className="text-sm font-black text-primary">{tier.share}%</span>
                    </div>
                    <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${tier.share}%` }}
                        transition={{ duration: 1.2, delay: i * 0.2 }}
                        className={`h-full ${tier.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Health Score */}
            <div className="premium-card p-8 bg-primary text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 -mr-12 -mt-12 rounded-full bg-white/5 blur-3xl" />
              <h4 className="text-sm font-bold opacity-70 mb-8 uppercase tracking-widest relative z-10">
                Transaction Health
              </h4>
              <div className="text-center relative z-10">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-[6px] border-white/20 border-t-white mb-6 relative">
                  <span className="text-4xl font-black">
                    {stats?.sales?.transactions_month || 0}
                    <span className="text-xs font-bold opacity-60 block -mt-1">txns</span>
                  </span>
                </div>
                <p className="font-bold text-base">30-Day Transactions</p>
                <p className="text-xs opacity-60 mt-2 font-medium">
                  {stats?.sales?.transactions_today || 0} today · {stats?.sales?.transactions_week || 0} this week
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 space-y-3 relative z-10">
                <div className="flex justify-between text-xs font-bold">
                  <span className="opacity-60 uppercase tracking-widest">Today</span>
                  <span>{stats?.sales?.transactions_today || 0} sales</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="opacity-60 uppercase tracking-widest">This Week</span>
                  <span>{stats?.sales?.transactions_week || 0} sales</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
