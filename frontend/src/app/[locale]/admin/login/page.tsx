'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setTokens } from '@/lib/api';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.tokens) {
        setTokens(data.tokens.accessToken, data.tokens.refreshToken);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        router.push('/admin');
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const responseError = err as { response?: { data?: { message?: string } } };
        setError(responseError.response?.data?.message || 'Invalid email or password');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-2xl mb-4 shadow-lg">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-wider">SECURE LOGIN</h1>
          <p className="text-xs text-gray-400 mt-1">Please enter your credentials to access the admin panel</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-800/80 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-gray-950 border border-gray-800 focus:border-white focus:ring-1 focus:ring-white rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-950 border border-gray-800 focus:border-white focus:ring-1 focus:ring-white rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}
