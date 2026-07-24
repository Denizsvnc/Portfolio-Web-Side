'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Server, Lock, Mail, User, Shield, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ContactSettingsPage() {
  const [formData, setFormData] = useState({
    host: '',
    port: 465,
    secure: true,
    user: '',
    password: '',
    from_email: '',
    auto_forward: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/contact/settings');
        if (res.data.data) {
          setFormData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/contact/settings', formData);
      toast.success('SMTP Ayarları başarıyla kaydedildi!');
    } catch (err) {
      toast.error('Ayarlar kaydedilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Yükleniyor...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 pt-8">
      <div className="flex items-center gap-4 border-b border-gray-800 pb-5">
        <Link
          href="/admin/contact"
          className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-heading text-white tracking-wider">SMTP Ayarları</h1>
          <p className="text-gray-400 text-sm mt-1">Ziyaretçilere e-posta ile yanıt verebilmek için sunucu ayarlarınızı yapılandırın.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-gray-400 font-semibold uppercase text-xs flex items-center gap-2">
              <Server size={14} /> SMTP Sunucu (Host)
            </label>
            <input
              type="text"
              required
              value={formData.host}
              onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              placeholder="smtp.gmail.com"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-400 font-semibold uppercase text-xs flex items-center gap-2">
              <Server size={14} /> Port
            </label>
            <input
              type="number"
              required
              value={formData.port}
              onChange={(e) => setFormData({ ...formData, port: Number(e.target.value) })}
              placeholder="465"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-400 font-semibold uppercase text-xs flex items-center gap-2">
              <User size={14} /> Kullanıcı Adı (E-Posta)
            </label>
            <input
              type="text"
              required
              value={formData.user}
              onChange={(e) => setFormData({ ...formData, user: e.target.value })}
              placeholder="ornek@gmail.com"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-400 font-semibold uppercase text-xs flex items-center gap-2">
              <Lock size={14} /> Şifre / App Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••••••"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition font-mono"
            />
          </div>

          <div className="space-y-2 md:col-span-2 border-t border-gray-800 pt-6 mt-2">
            <label className="block text-gray-400 font-semibold uppercase text-xs flex items-center gap-2">
              <Mail size={14} /> Gönderici Adresi (From Email)
            </label>
            <input
              type="email"
              required
              value={formData.from_email}
              onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
              placeholder="iletisim@denizsevinc.com.tr"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition font-mono"
            />
            <p className="text-xs text-gray-500 mt-2">Ziyaretçilere giden yanıtlarda görünecek e-posta adresi.</p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-950 border border-gray-800 rounded-xl hover:border-gray-700 transition">
              <input
                type="checkbox"
                checked={formData.secure}
                onChange={(e) => setFormData({ ...formData, secure: e.target.checked })}
                className="w-5 h-5 accent-blue-500 rounded bg-gray-900 border-gray-700"
              />
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm flex items-center gap-2"><Shield size={14} className="text-emerald-400" /> Secure (SSL/TLS) Kullan</span>
                <span className="text-xs text-gray-500">465 portu için genellikle aktif, 587 portu için pasif (STARTTLS) olmalıdır.</span>
              </div>
            </label>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-950 border border-gray-800 rounded-xl hover:border-gray-700 transition">
              <input
                type="checkbox"
                checked={formData.auto_forward}
                onChange={(e) => setFormData({ ...formData, auto_forward: e.target.checked })}
                className="w-5 h-5 accent-blue-500 rounded bg-gray-900 border-gray-700"
              />
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm flex items-center gap-2"><Mail size={14} className="text-blue-400" /> Otomatik Yönlendirme (Auto-Forward)</span>
                <span className="text-xs text-gray-500">Ziyaretçilerden gelen yeni mesajları anında <strong>{formData.user || "kendi adresinize"}</strong> e-posta olarak iletir.</span>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : <><Save size={18} /> Ayarları Kaydet</>}
          </button>
        </div>

      </form>
    </div>
  );
}
