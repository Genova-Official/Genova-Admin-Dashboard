'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download
} from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/data/analytics/')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-[#610B63] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#610B63] tracking-tight">Platform Analytics</h1>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-1">Ecosystem Growth & Trends</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-100 rounded-lg text-sm font-bold text-gray-600 shadow-sm">
              <Filter size={16} /> Filter
           </button>
           <button className="flex items-center gap-2 px-6 py-2 bg-[#610B63] text-white rounded-lg text-sm font-bold shadow-sm">
              <Download size={16} /> Export Intelligence
           </button>
        </div>
      </div>

      {/* Growth Chart Placeholder */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
         <div className="flex items-center justify-between mb-10">
            <div>
               <h3 className="text-xl font-bold text-gray-900">Ecosystem Growth</h3>
               <p className="text-sm text-gray-400 font-medium">Daily transaction volume across all businesses.</p>
            </div>
            <div className="flex items-center gap-2 text-green-500 font-bold">
               <ArrowUpRight size={20} />
               <span>+14.2%</span>
            </div>
         </div>

         <div className="h-[300px] w-full flex items-end justify-between gap-2 px-4">
            {/* Simple Animated SVG Bar Chart */}
            {data?.daily_sales.map((day: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${(day.total / 10000) * 100}%` }}
                transition={{ delay: i * 0.05, duration: 1 }}
                className="flex-1 bg-[#FDE8FE] hover:bg-[#610B63] transition-colors rounded-t-sm group relative"
              >
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    N{day.total.toLocaleString()}
                 </div>
              </motion.div>
            ))}
         </div>
         <div className="flex justify-between mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">
            <span>30 Days Ago</span>
            <span>Today</span>
         </div>
      </div>

      {/* Analytics Insight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-6">Active vs Inactive Businesses</h4>
            <div className="space-y-6">
               {[
                 { label: 'Active (Daily)', value: 842, color: 'bg-green-500', percent: 68 },
                 { label: 'Passive (Weekly)', value: 312, color: 'bg-blue-500', percent: 25 },
                 { label: 'Inactive', value: 88, color: 'bg-gray-200', percent: 7 },
               ].map((item, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                       <span className="text-gray-500">{item.label}</span>
                       <span className="text-[#610B63]">{item.value}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${item.percent}%` }}
                         className={`h-full ${item.color}`}
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-6">Top Industries</h4>
            <div className="space-y-4">
               {[
                 { label: 'Retail & Supermarkets', share: '42%' },
                 { label: 'Hospitality & Hotels', share: '18%' },
                 { label: 'Pharmacies', share: '15%' },
                 { label: 'Service Providers', share: '12%' },
                 { label: 'Others', share: '13%' },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-bold text-gray-600">{item.label}</span>
                    <span className="text-sm font-black text-[#610B63]">{item.share}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
