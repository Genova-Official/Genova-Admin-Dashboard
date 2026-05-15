'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { Loader2, Eye, EyeOff, ShieldCheck, Command, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // For now, if the backend isn't ready for /auth/login, we might need to adjust
      // But based on the previous code, it expects this endpoint.
      await api.post('/auth/login/', { email, password });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed. Please verify credentials.');
      // Temporary: Allow bypass to OTP for testing if needed, but let's stick to real flow
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/verify-otp/', { email, otp });
      setAuth(res.data.access, res.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid security code provided.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-accent/30 flex flex-col items-center justify-center p-6 selection:bg-primary selection:text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      {/* Brand Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-col items-center relative z-10"
      >
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/30 mb-4">
          <Command size={32} />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-foreground font-black text-3xl tracking-tighter">GENOVA</span>
          <span className="text-secondary font-bold text-[10px] tracking-[0.4em] uppercase mt-1">Operational Console</span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[480px] w-full bg-background rounded-3xl shadow-2xl shadow-primary/5 border border-border p-10 relative z-10"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            {step === 1 ? 'Command Authorization' : 'Security Verification'}
          </h1>
          <p className="text-secondary text-sm font-medium mt-1">
            {step === 1 ? 'Enter your credentials to access the console.' : `Enter the code sent to ${email}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleLogin} 
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="command-input"
                  placeholder="admin@genovatransact.com"
                  required
                />
              </div>
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Access Key</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="command-input pr-12"
                    placeholder="••••••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20" id="remember" />
                  <label htmlFor="remember" className="text-xs text-secondary font-medium">Keep session active</label>
                </div>
                <button type="button" className="text-xs font-bold text-primary hover:underline">
                  Reset Key?
                </button>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] p-3 rounded-xl font-bold flex items-center gap-2"
                >
                  <AlertCircle size={14} /> {error}
                </motion.div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="premium-button w-full h-12 text-sm"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                  <>Authorize Access <ArrowRight size={16} className="ml-2" /></>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp} 
              className="space-y-6"
            >
               <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest text-center block">6-Digit Security Code</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="command-input text-center tracking-[1em] font-black text-2xl h-16"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] p-3 rounded-xl font-bold text-center">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="premium-button w-full h-12 text-sm"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Verify & Continue'}
              </button>
              
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <Lock size={14} /> Use different credentials
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-8 flex items-center gap-2 text-secondary/40">
        <ShieldCheck size={14} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Grade Security Enabled</span>
      </div>
    </div>
  );
}

function AlertCircle(props: any) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
