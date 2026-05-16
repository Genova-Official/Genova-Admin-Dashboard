'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Mail, 
  Shield, 
  MapPin,
  MoreVertical,
  ExternalLink,
  Briefcase,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface StaffMember {
  id: number;
  email: string;
  name: string;
  role: string;
  roles: string[];
  is_active: boolean;
  user_status: string;
  created_at: string;
  location?: {
    location_name: string;
  };
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get('/staff/');
      setStaff(res.data);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Staff Directory</h1>
          <p className="text-secondary font-medium text-sm mt-1">Platform-wide personnel management for corporate entities</p>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
          <UserPlus size={18} /> Provision New User
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
          <input 
            type="text" 
            placeholder="Search by name, email, or role..."
            className="command-input pl-12"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-accent/50 border border-border rounded-xl text-sm font-bold text-secondary">
          <Filter size={16} /> Role Filtering
        </button>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-secondary uppercase tracking-widest">Compiling Personnel Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <motion.div 
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card p-6 group hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl border border-border p-0.5 overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.email}&backgroundColor=610B63&fontFamily=Outfit&fontWeight=700`} 
                      alt={member.name} 
                      className="w-full h-full rounded-[14px] object-cover"
                    />
                  </div>
                  {member.is_active && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <button className="p-2 text-secondary hover:text-primary transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="font-black text-xl text-foreground truncate">{member.name || 'Genova User'}</h3>
                <div className="flex items-center gap-2 text-secondary text-xs font-medium">
                  <Mail size={12} className="text-secondary/40" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-lg flex items-center gap-2 text-primary">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{member.role || member.roles?.[0] || 'Member'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-xs font-bold text-secondary">
                    <MapPin size={14} className="text-secondary/40" />
                    <span>{member.location?.location_name || 'Global HQ / Remote'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-secondary">
                    <Calendar size={14} className="text-secondary/40" />
                    <span>Joined {new Date(member.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent text-secondary hover:text-primary hover:bg-primary/5 rounded-xl text-xs font-bold transition-all">
                  <ExternalLink size={14} /> View Detailed Audit Trail
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
