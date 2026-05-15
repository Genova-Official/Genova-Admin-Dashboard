'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

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
      await api.post('/auth/login/', { email, password });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
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
      setError(err.response?.data?.error || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex flex-col items-center justify-center p-6">
      {/* Brand Logo */}
      <div className="mb-12">
        <div className="flex flex-col items-center">
           <div className="text-[#610B63] font-black text-6xl flex flex-col items-center">
              <span className="text-7xl mb-[-10px]">G</span>
              <span className="text-4xl tracking-tighter uppercase">Genova</span>
           </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[500px] w-full bg-white rounded-xl shadow-sm p-12"
      >
        <h1 className="text-2xl font-bold text-[#610B63] text-center mb-10">Login to Dashboard</h1>

        {step === 1 ? (
          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="genova-input"
                placeholder="johndoe@gmail.com"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="genova-input pr-10"
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-3 text-gray-400 hover:text-[#610B63]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="text-right">
              <button type="button" className="text-sm font-bold text-[#610B63] hover:underline">
                Forgot Password?
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-xs text-center font-bold">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="genova-button flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account? <button type="button" className="text-[#610B63] font-bold hover:underline">Sign Up?</button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-8">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP Verification</label>
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="genova-input text-center tracking-[1em] font-black text-2xl"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-xs text-center font-bold">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="genova-button"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Verify Access'}
            </button>
            
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-sm text-gray-400 hover:text-[#610B63] mt-4"
            >
              Go back to credentials
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
