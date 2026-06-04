'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { 
  TrendingUp, 
  ArrowUpRight,
  Filter,
  Download,
  BarChart3,
  Calendar,
  Crown,
  Building2,
  Sparkles
} from 'lucide-react';

interface DailySale {
  day: string;
  total: number;
  count: number;
}

interface TopBusiness {
  name: string;
  email: string;
  total_volume: number;
  transaction_count: number;
}

interface MonthlySummary {
  month: string;
  revenue: number;
  transactions: number;
}

interface AnalyticsData {
  daily_sales: DailySale[];
  top_businesses: TopBusiness[];
  monthly_summary: MonthlySummary[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/'),
      api.get('/stats/global/'),
    ])
      .then(([analyticsRes, statsRes]) => {
        setData(analyticsRes.data);
        setStats(statsRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 })
      .format(val || 0)
      .replace('NGN', '₦');

  const maxTotal = data?.daily_sales?.length
    ? Math.max(...data.daily_sales.map(d => Number(d.total)))
    : 1;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-secondary text-sm font-bold animate-pulse uppercase tracking-widest">
        Loading Platform Analytics...
      </p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Platform Analytics</h1>
          <p className="text-secondary font-semibold text-sm uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
            <BarChart3 size={14} className="text-primary" /> Ecosystem Growth &amp; Trends
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-secondary">
            <Calendar size={14} /> Last 30 Days
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-secondary hover:text-primary hover:border-primary transition-all">
            <Filter size={14} /> Filter
          </button>
          <button className="premium-button text-xs">
            <Download size={14} /> Export Intelligence
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Volume', value: formatCurrency(stats?.sales?.total_volume || 0) },
          { label: 'Active Businesses', value: stats?.businesses?.active || 0 },
          { label: 'Transactions (Month)', value: (stats?.sales?.transactions_month || 0).toLocaleString() },
          { label: 'VAT Collected', value: formatCurrency(stats?.sales?.total_vat || 0) },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="premium-card p-5"
          >
            <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-xl font-black text-foreground tracking-tight">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="premium-card p-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl font-bold text-foreground">Ecosystem Growth</h3>
            <p className="text-sm text-secondary font-medium mt-1">Daily transaction volume across all businesses</p>
          </div>
          <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl">
            <ArrowUpRight size={16} />
            <span>Live Data</span>
          </div>
        </div>

        {data?.daily_sales && data.daily_sales.length > 0 ? (
          <>
            <div className="h-[280px] w-full flex items-end justify-between gap-1.5 px-2">
              {data.daily_sales.map((day, i) => {
                const heightPct = maxTotal > 0 ? (Number(day.total) / maxTotal) * 100 : 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ delay: i * 0.04, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 bg-primary/10 hover:bg-primary transition-colors rounded-t-lg group relative cursor-pointer min-h-[4px]"
                    style={{ minHeight: '4px' }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg pointer-events-none">
                      <p className="font-bold">{formatCurrency(Number(day.total))}</p>
                      <p className="opacity-60">{day.count} txns · {new Date(day.day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-black text-secondary/40 uppercase tracking-widest px-2">
              <span>{new Date(data.daily_sales[0]?.day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
              <span>Today</span>
            </div>
          </>
        ) : (
          <div className="h-[280px] flex items-center justify-center">
            <p className="text-secondary/40 font-bold uppercase tracking-widest text-sm">No transaction data in this period</p>
          </div>
        )}
      </div>

      {/* Analytics Insight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Business Activity Breakdown */}
        <div className="premium-card p-8">
          <h4 className="text-lg font-bold text-foreground mb-6">Business Activity Breakdown</h4>
          <div className="space-y-6">
            {[
              { label: 'Active Businesses', value: stats?.businesses?.active || 0, percent: stats?.businesses?.total ? Math.round(((stats.businesses.active || 0) / stats.businesses.total) * 100) : 0, color: 'bg-green-500' },
              { label: 'Total Locations', value: stats?.branches?.total || 0, percent: 100, color: 'bg-primary' },
              { label: 'Staff Force', value: stats?.staff?.total || 0, percent: 100, color: 'bg-purple-400' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-secondary">{item.label}</span>
                  <span className="text-primary">{item.value.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ delay: i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Snapshot */}
        <div className="premium-card p-8">
          <h4 className="text-lg font-bold text-foreground mb-6">Inventory Snapshot</h4>
          <div className="space-y-4">
            {[
              { label: 'Total Inventory Items', value: (stats?.inventory?.total_count || 0).toLocaleString() },
              { label: 'Inventory Asset Value', value: formatCurrency(stats?.inventory?.total_value || 0) },
              { label: 'Unique Product Lines', value: (stats?.inventory?.total_products || 0).toLocaleString() },
              { label: 'Low Stock Alerts', value: (stats?.inventory?.low_stock_alerts || 0).toLocaleString(), alert: (stats?.inventory?.low_stock_alerts || 0) > 0 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                  item.alert
                    ? 'bg-orange-500/5 border-orange-500/20'
                    : 'bg-accent/30 border-border hover:border-primary/20'
                }`}
              >
                <span className={`text-sm font-bold ${item.alert ? 'text-orange-600' : 'text-secondary'}`}>{item.label}</span>
                <span className={`text-sm font-black ${item.alert ? 'text-orange-600' : 'text-primary'}`}>{item.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Businesses & Monthly Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Businesses */}
        <div className="premium-card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Crown className="text-amber-500" size={20} />
                Top Performing Businesses
              </h4>
              <p className="text-xs text-secondary mt-1">Leading entities by sales volume</p>
            </div>
            <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">
              Top 5 Leaders
            </span>
          </div>

          <div className="space-y-4">
            {data?.top_businesses && data.top_businesses.length > 0 ? (
              data.top_businesses.map((biz, i) => {
                const maxVolume = Math.max(...data.top_businesses.map(b => b.total_volume), 1);
                const pct = Math.round((biz.total_volume / maxVolume) * 100);
                return (
                  <motion.div
                    key={biz.email}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl border border-border bg-accent/20 hover:border-primary/20 transition-all flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold text-xs">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm">{biz.name || 'Unnamed Business'}</p>
                          <p className="text-[10px] text-secondary/60">{biz.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-foreground">{formatCurrency(biz.total_volume)}</p>
                        <p className="text-[10px] text-secondary/60">{biz.transaction_count} txns</p>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="py-12 text-center text-secondary/40">
                <Building2 size={36} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs font-bold uppercase tracking-wider">No Business Activity Recorded</p>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Revenue Trend */}
        <div className="premium-card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="text-primary" size={20} />
                Monthly Revenue Trend
              </h4>
              <p className="text-xs text-secondary mt-1">Financial summary over the last 6 months</p>
            </div>
            <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">
              Macro Trends
            </span>
          </div>

          <div className="space-y-4">
            {data?.monthly_summary && data.monthly_summary.length > 0 ? (
              data.monthly_summary.map((month, i) => {
                const maxRevenue = Math.max(...data.monthly_summary.map(m => m.revenue), 1);
                const pct = Math.round((month.revenue / maxRevenue) * 100);
                return (
                  <motion.div
                    key={month.month}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl border border-border bg-accent/20 hover:border-primary/20 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-20 text-xs font-black text-secondary uppercase tracking-wider">
                        {month.month}
                      </div>
                      <div className="flex-1 hidden sm:block">
                        <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 rounded-full transition-all" 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-foreground">{formatCurrency(month.revenue)}</p>
                      <p className="text-[10px] text-secondary/60">{month.transactions} transactions</p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="py-12 text-center text-secondary/40">
                <Calendar size={36} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs font-bold uppercase tracking-wider">No Monthly Summary Available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
