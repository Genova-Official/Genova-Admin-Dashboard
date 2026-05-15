'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  ArrowUpRight,
  Filter,
  Calendar,
  CreditCard,
  Banknote
} from 'lucide-react';

export default function RevenueInsightsPage() {
  return (
    <div className="space-y-12 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#610B63] tracking-tight">Revenue Insights</h1>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-1">Platform Financial Intelligence</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-lg text-sm font-bold text-gray-600 shadow-sm">
              <Calendar size={16} /> Last 30 Days
           </div>
           <button className="flex items-center gap-2 px-6 py-2 bg-[#610B63] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#4a084c] transition-colors">
              <Filter size={16} /> Deep Filter
           </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Platform Sales', value: 'N842,400,000', icon: Banknote, trend: '+8.2%', color: 'indigo' },
          { label: 'VAT Generated', value: 'N63,180,000', icon: CreditCard, trend: '+5.4%', color: 'purple' },
          { label: 'Avg Sale Value', value: 'N14,200', icon: TrendingUp, trend: '+1.2%', color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon size={120} />
             </div>
             <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
             <h3 className="text-4xl font-black text-[#610B63] mb-4">{stat.value}</h3>
             <div className="flex items-center gap-2 text-green-500 font-bold text-xs">
                <ArrowUpRight size={16} /> {stat.trend} <span className="text-gray-400">vs last month</span>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Monthly Revenue Breakdown */}
         <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
               <h4 className="text-lg font-bold text-gray-900">Revenue Contribution by Business Tier</h4>
               <PieChart className="text-gray-300" size={20} />
            </div>
            <div className="space-y-8">
               {[
                 { label: 'Enterprise Partners', amount: 'N482.4M', share: 57, color: 'bg-[#610B63]' },
                 { label: 'Standard Businesses', amount: 'N240.8M', share: 29, color: 'bg-purple-400' },
                 { label: 'Early-stage Outlets', amount: 'N119.2M', share: 14, color: 'bg-purple-200' },
               ].map((tier, i) => (
                 <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                       <div>
                          <p className="text-sm font-bold text-gray-900">{tier.label}</p>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{tier.amount}</p>
                       </div>
                       <span className="text-sm font-black text-[#610B63]">{tier.share}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${tier.share}%` }}
                         className={`h-full ${tier.color}`}
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Quick Payment Stats */}
         <div className="bg-[#610B63] p-10 rounded-2xl text-white shadow-xl flex flex-col justify-between">
            <h4 className="text-lg font-bold opacity-80 mb-10">Sales Health Score</h4>
            <div className="text-center">
               <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-purple-400/30 border-t-white mb-6">
                  <span className="text-4xl font-black">94<span className="text-xl">%</span></span>
               </div>
               <p className="font-bold text-lg">Excellent Efficiency</p>
               <p className="text-xs opacity-60 mt-2 font-medium">Platform-wide payment success rate is above benchmark.</p>
            </div>
            <div className="mt-10 pt-10 border-t border-white/10 space-y-4">
               <div className="flex justify-between text-xs font-bold">
                  <span className="opacity-60 uppercase tracking-widest">Failed Sales</span>
                  <span>1.2%</span>
               </div>
               <div className="flex justify-between text-xs font-bold">
                  <span className="opacity-60 uppercase tracking-widest">Pending Payouts</span>
                  <span>4.4%</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
