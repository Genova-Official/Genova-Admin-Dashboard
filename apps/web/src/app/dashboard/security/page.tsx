'use client';

import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Eye, 
  Terminal, 
  Fingerprint,
  ShieldAlert,
  History,
  Smartphone,
  Globe,
  Settings,
  ChevronRight
} from 'lucide-react';

export default function SecurityPage() {
  const SECURITY_METRICS = [
    { label: 'System Integrity', value: '100%', status: 'optimal' },
    { label: 'Active Sessions', value: '4', status: 'normal' },
    { label: 'Encryption Standard', value: 'AES-256', status: 'secure' },
    { label: 'Last Threat Scan', value: '2m ago', status: 'clean' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Access Control & Security</h1>
          <p className="text-secondary font-medium text-sm mt-1">Enterprise-grade security management and audit infrastructure</p>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 border border-green-500/20 rounded-xl text-xs font-bold">
              <ShieldCheck size={14} /> Firewall Active
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SECURITY_METRICS.map((metric) => (
          <div key={metric.label} className="premium-card p-6">
            <p className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] mb-2">{metric.label}</p>
            <div className="flex items-end justify-between">
              <h4 className="text-2xl font-black text-foreground">{metric.value}</h4>
              <div className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                {metric.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black text-foreground flex items-center gap-3">
             <Fingerprint className="text-primary" /> Security Configuration
          </h2>
          
          <div className="space-y-4">
            {[
              { title: 'Two-Factor Authentication', desc: 'Enforce biometric or app-based 2FA for all administrative accounts.', icon: Smartphone, active: true },
              { title: 'API Access Keys', desc: 'Manage cryptographically secure keys for infrastructure integration.', icon: Key, active: true },
              { title: 'IP Whitelisting', desc: 'Restrict console access to specific organizational network ranges.', icon: Globe, active: false },
              { title: 'Session Persistence', desc: 'Define automatic logout intervals for inactive administrative sessions.', icon: History, active: true },
            ].map((item) => (
              <div key={item.title} className="premium-card p-6 flex items-center justify-between group cursor-pointer hover:border-primary/20 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-secondary group-hover:text-primary transition-colors">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="text-xs text-secondary mt-1">{item.desc}</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${item.active ? 'bg-primary' : 'bg-accent border border-border'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${item.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-black text-foreground flex items-center gap-3">
             <Terminal className="text-primary" /> Security Activity
          </h2>
          <div className="premium-card p-6 space-y-6">
            {[
              { type: 'auth', msg: 'Successful login from Abuja, NG', time: '12m ago', level: 'info' },
              { type: 'key', msg: 'Production API key rotated', time: '2h ago', level: 'warning' },
              { type: 'access', msg: 'New branch provisioned: Lekki Phase 1', time: '5h ago', level: 'info' },
              { type: 'alert', msg: 'Failed login attempt detected', time: '1d ago', level: 'danger' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  log.level === 'danger' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                  log.level === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <p className="text-xs font-bold text-foreground leading-tight">{log.msg}</p>
                  <p className="text-[10px] font-medium text-secondary mt-1 uppercase tracking-wider">{log.time}</p>
                </div>
              </div>
            ))}
            <button className="w-full pt-4 border-t border-border text-xs font-bold text-primary hover:underline flex items-center justify-center gap-2">
              View Comprehensive Audit Logs <ChevronRight size={14} />
            </button>
          </div>

          <div className="premium-card p-6 bg-primary text-white border-none shadow-xl shadow-primary/20">
             <div className="flex items-center gap-3 mb-4">
                <ShieldAlert size={24} />
                <h3 className="font-black text-lg">Infrastructure Lock</h3>
             </div>
             <p className="text-xs text-white/80 leading-relaxed mb-6">
                In case of emergency, you can immediately revoke all active administrative sessions and API keys across the entire platform.
             </p>
             <button className="w-full py-3 bg-white text-primary rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white/90 transition-all">
                Emergency Protocol
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
