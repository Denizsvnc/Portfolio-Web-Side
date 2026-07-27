'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Save, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState({
    github_url: 'https://github.com/Denizsvnc',
    linkedin_url: 'https://www.linkedin.com/in/deniz-sevinç-819529261',
    phone_number: '+905478985659',
    email_address: 'info@denizsevinc.com.tr',
    instagram_url: 'https://www.instagram.com/denizsevinc0_/',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data.data && Object.keys(data.data).length > 0) {
        setSettings((prev) => ({ ...prev, ...data.data }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', settings);
      toast.success('Site ayarları başarıyla güncellendi.');
    } catch (err) {
      toast.error('Ayarlar güncellenirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
        <Settings size={28} className="text-white" />
        <div>
          <h1 className="text-2xl font-bold font-heading">İletişim & Sosyal Medya Ayarları</h1>
          <p className="text-xs text-gray-400 mt-1">Sitenizin sol menüsünde ve footer'da yer alan genel iletişim linklerini buradan değiştirebilirsiniz.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Yükleniyor...</div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">GitHub Profil URL</label>
              <input
                type="url"
                value={settings.github_url}
                onChange={(e) => setSettings({ ...settings, github_url: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white transition"
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">LinkedIn Profil URL</label>
              <input
                type="url"
                value={settings.linkedin_url}
                onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white transition"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Telefon Numarası</label>
              <input
                type="text"
                value={settings.phone_number}
                onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white transition"
                placeholder="+905551234567"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">E-posta Adresi</label>
              <input
                type="email"
                value={settings.email_address}
                onChange={(e) => setSettings({ ...settings, email_address: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white transition"
                placeholder="info@denizsevinc.com.tr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Instagram Profil URL</label>
              <input
                type="url"
                value={settings.instagram_url}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white transition"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
