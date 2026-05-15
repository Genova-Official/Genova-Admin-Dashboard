'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  Zap,
  Server
} from 'lucide-react';

export default function SystemHealthPage() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const metrics = [
    { label: 'API Gateway', status: 'Operational', latency: '42ms', uptime: '99.99%', icon: Globe, color: 'text-green-500' },
    { label: 'Production DB', status: 'Healthy', latency: '12ms', uptime: '100%', icon: Database, color: 'text-blue-500' },
    { label: 'Auth Service', status: 'Operational', latency: '28ms', uptime: '99.98%', icon: ShieldCheck, color: 'text-purple-500' },
    { label: 'Worker Queue', status: 'Idle', latency: '0ms', uptime: '99.95%', icon: Cpu, color: 'text-orange-500' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-[#610B63] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Health</h1>
          <p className="text-gray-500 font-medium">Real-time telemetry and platform infrastructure monitoring.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-green-50 rounded-lg border border-green-100">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-sm font-bold text-green-700 uppercase tracking-widest">Platform Operational</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Avg Latency', value: '31ms', trend: '-2ms', icon: Zap },
           { label: 'Uptime (30d)', value: '99.98%', trend: 'stable', icon: Clock },
           { label: 'Active Sessions', value: '1,242', trend: '+12%', icon: Users },
           { label: 'Resource Usage', value: '24%', trend: 'normal', icon: Server },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <stat.icon className="text-[#610B63]" size={20} />
                 <span className="text-[10px] font-black text-green-500 uppercase">{stat.trend}</span>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
           </div>
         ))}
      </div>

      {/* Detailed Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
               <h3 className="text-lg font-bold text-gray-900">Service Status</h3>
            </div>
            <div className="divide-y divide-gray-50">
               {metrics.map((service, i) => (
                 <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className={`p-3 rounded-lg bg-white border border-gray-100 ${service.color}`}>
                          <service.icon size={20} />
                       </div>
                       <div>
                          <p className="font-bold text-gray-900">{service.label}</p>
                          <p className="text-xs text-gray-400 font-medium">Uptime: {service.uptime}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="text-xs font-black text-green-500 uppercase tracking-widest">{service.status}</span>
                       <p className="text-xs text-gray-400 font-bold">{service.latency}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Log Stream Placeholder */}
         <div className="bg-slate-900 rounded-xl p-8 font-mono text-xs text-emerald-400 overflow-hidden shadow-2xl relative">
            <div className="absolute top-4 right-4 flex gap-2">
               <div className="w-2 h-2 rounded-full bg-red-500"></div>
               <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <p className="text-slate-500 mb-4 tracking-widest uppercase text-[10px] font-black">Live Operational Logs</p>
            <div className="space-y-2">
               <p><span className="text-slate-500">[14:08:12]</span> <span className="text-white">INFO</span> AUTH_SERVICE: User session verified (admin@genova.com)</p>
               <p><span className="text-slate-500">[14:08:15]</span> <span className="text-white">INFO</span> API_GATEWAY: GET /api/data/stats - 200 OK (14ms)</p>
               <p><span className="text-slate-500">[14:08:22]</span> <span className="text-white">INFO</span> DB_PROD: Pool size optimized (8/20 connections)</p>
               <p><span className="text-slate-500">[14:08:31]</span> <span className="text-white">INFO</span> ANALYTICS: Batch processing completed for 42 businesses</p>
               <p><span className="text-emerald-500 animate-pulse">_</span></p>
            </div>
         </div>
      </div>
    </div>
  );
}

function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
