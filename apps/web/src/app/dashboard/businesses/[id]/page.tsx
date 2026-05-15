'use client';

import { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { 
  ChevronLeft, 
  Filter,
  Share2
} from 'lucide-react';
import Link from 'next/link';

interface BusinessDetail {
  user: {
    id: number;
    email: string;
    name: string;
    first_name: string;
    last_name: string;
    status: string;
    is_verified: boolean;
    created_at: string;
    last_login: string;
  };
  locations: {
    id: string;
    name: string;
    is_main: boolean;
    status: string;
    created_at: string;
  }[];
  staff: {
    id: number;
    email: string;
    name: string;
    status: string;
    last_login: string;
  }[];
  stats: {
    total_sales: number;
    sales_count: number;
  };
}

export default function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<BusinessDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'transactions' | 'profile'>('transactions');

  useEffect(() => {
    api.get(`/data/businesses/${id}/`)
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(val).replace('NGN', 'N');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-[#610B63] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data) return <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest">Business Not Found</div>;

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/businesses" className="text-gray-400 hover:text-[#610B63]">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-[#610B63]">Business Overview</h1>
      </div>

      {/* Balance Cards & Profile Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="bg-[#5D5FEF] rounded-xl p-8 text-white flex flex-col justify-between h-[200px] shadow-lg">
           <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Total Sales Balance</p>
           <h2 className="text-4xl font-bold">{formatCurrency(data.stats.total_sales)}</h2>
           <p className="text-[10px] opacity-60">Record timestamp: {new Date().toLocaleString()}</p>
        </div>
        
        <div className="bg-[#FFC451] rounded-xl p-8 text-white flex flex-col justify-between h-[200px] shadow-lg">
           <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Inventory Asset Value</p>
           <h2 className="text-4xl font-bold">{formatCurrency(data.stats.total_sales * 0.8)}</h2> {/* Placeholder logic */}
           <p className="text-[10px] opacity-60">Account tracking active</p>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex items-center gap-8">
           <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-sm">
             <img 
               src={`https://ui-avatars.com/api/?name=${data.user.name}&background=610B63&color=fff`} 
               alt="Avatar" 
               className="w-full h-full object-cover"
             />
           </div>
           <div className="flex-1">
             <h3 className="text-2xl font-bold text-[#610B63] mb-1">{data.user.name}</h3>
             <p className="text-sm text-gray-500 font-bold mb-3">{data.user.email}</p>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">User since {new Date(data.user.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-gray-100">
           <div className="flex gap-12">
              <button 
                onClick={() => setActiveTab('transactions')}
                className={`pb-4 text-xl font-bold transition-all ${activeTab === 'transactions' ? 'text-[#610B63] border-b-4 border-[#610B63]' : 'text-gray-400'}`}
              >
                Transactions
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`pb-4 text-xl font-bold transition-all ${activeTab === 'profile' ? 'text-[#610B63] border-b-4 border-[#610B63]' : 'text-gray-400'}`}
              >
                Profile Information
              </button>
           </div>
           <div className="flex items-center gap-4 mb-4">
              <button className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-100 rounded-lg text-sm font-bold text-gray-600 shadow-sm">
                 <Share2 size={16} /> Export
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-100 rounded-lg text-sm font-bold text-gray-600 shadow-sm">
                 <Filter size={16} /> Filter
              </button>
           </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'transactions' ? (
              <motion.div
                key="transactions"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#610B63] text-white">
                      <th className="px-6 py-4 text-xs font-bold uppercase">Timestamp</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase">Description</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase">Type</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {/* Placeholder transactions for now */}
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5 text-sm text-[#610B63] font-bold">Dec 10.24-10:30PM</td>
                        <td className="px-6 py-5 text-sm text-[#610B63] font-bold">Sales Record</td>
                        <td className="px-6 py-5 text-sm text-[#610B63] font-bold">Credit</td>
                        <td className="px-6 py-5 text-center">
                          <span className={`px-6 py-2 rounded-full text-xs font-bold ${i % 2 === 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {i % 2 === 0 ? 'Success' : 'Failed'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-[#610B63] font-bold">N20,000</td>
                        <td className="px-6 py-5 text-sm text-[#610B63] font-bold">N200,000</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-12 space-y-12"
              >
                <div>
                   <h4 className="text-2xl font-bold text-[#610B63] mb-10">Personal Data</h4>
                   <div className="grid grid-cols-2 gap-12">
                      <div className="space-y-4">
                         <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Name</p>
                         <div className="p-4 bg-white border border-gray-100 rounded-lg text-[#610B63] font-bold">{data.user.name}</div>
                      </div>
                      <div className="space-y-4">
                         <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Email</p>
                         <div className="p-4 bg-white border border-gray-100 rounded-lg text-[#610B63] font-bold">{data.user.email}</div>
                      </div>
                      <div className="space-y-4">
                         <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Phone Number</p>
                         <div className="p-4 bg-white border border-gray-100 rounded-lg text-[#610B63] font-bold">+234 ••••• ••••</div>
                      </div>
                      <div className="space-y-4">
                         <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Address</p>
                         <div className="p-4 bg-white border border-gray-100 rounded-lg text-[#610B63] font-bold">Not Provided</div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
