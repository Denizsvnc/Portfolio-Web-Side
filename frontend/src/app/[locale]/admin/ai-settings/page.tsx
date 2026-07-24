'use client';
import { useTranslations } from 'next-intl';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Bot, Settings, Sparkles, UserCheck, Play } from 'lucide-react';

export default function AiSettingsPage() {
  const t = useTranslations('Admin.aiSettings');
  const [activeTab, setActiveTab] = useState<'persona' | 'settings' | 'calendar'>('persona');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  const [settings, setSettings] = useState<any>({});
  const [customTopic, setCustomTopic] = useState('');
  
  // Plans state
  const [plans, setPlans] = useState<any[]>([]);
  const [newPlanTopic, setNewPlanTopic] = useState('');
  const [newPlanDate, setNewPlanDate] = useState('');
  
  // Persona questions state
  const [answers, setAnswers] = useState({
    q1: '', // Ne tür blog yazıları yazmak istersin?
    q2: '', // Hedef kitlen kim? (Yeni başlayanlar, uzmanlar, vb.)
    q3: '', // Yazı dilin nasıl olmalı? (Resmi, samimi, mizahi)
    q4: '', // Uzmanlık alanların neler?
  });

  useEffect(() => {
    fetchSettings();
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/ai/plans');
      if (res.data?.success) setPlans(res.data.data);
    } catch (error) {
      console.error('Planlar yüklenemedi');
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await api.get('/ai/settings');
      if (res.data?.success) {
        setSettings(res.data.data);
        if (res.data.data.personaData) {
          setAnswers(res.data.data.personaData);
        }
      }
    } catch (error) {
      toast.error('Ayarlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await api.put('/ai/settings', settings);
      toast.success('Ayarlar kaydedildi');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ayarlar kaydedilemedi');
    }
  };

  const analyzePersona = async () => {
    setAnalyzing(true);
    try {
      const res = await api.post('/ai/analyze', { answers });
      if (res.data?.success) {
        toast.success('Persona başarıyla analiz edildi ve kaydedildi!');
        fetchSettings(); // Refresh
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Persona analizi başarısız oldu');
    } finally {
      setAnalyzing(false);
    }
  };

  const triggerGeneration = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/ai/trigger', { customTopic: customTopic.trim() || undefined });
      if (res.data?.success) {
        toast.success('AI Blog üretimi başarıyla tamamlandı!');
        setCustomTopic('');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Üretim başlatılamadı');
    } finally {
      setGenerating(false);
    }
  };

  const addPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanTopic || !newPlanDate) return toast.error('Konu ve tarih zorunlu');
    try {
      await api.post('/ai/plans', { topic: newPlanTopic, scheduledDate: newPlanDate });
      toast.success('Plan eklendi');
      setNewPlanTopic('');
      setNewPlanDate('');
      fetchPlans();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Plan eklenemedi');
    }
  };

  const deletePlan = async (id: string) => {
    if (!confirm('Planı silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/ai/plans/${id}`);
      toast.success('Plan silindi');
      fetchPlans();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Plan silinemedi');
    }
  };

  if (loading) return <div className="p-8 text-white">Yükleniyor...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto text-gray-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-purple-500/20 rounded-xl">
          <Bot className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Otomasyon & Persona</h1>
          <p className="text-gray-400">Blog yazılarınızı yapay zeka ile otomatikleştirin.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('persona')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
            activeTab === 'persona' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          Kişilik (Persona) Analizi
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
            activeTab === 'settings' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Settings className="w-5 h-5" />
          Otomasyon Ayarları
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
            activeTab === 'calendar' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          İçerik Takvimi
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        {activeTab === 'persona' ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Sizi Tanıyalım
            </h2>
            <p className="text-gray-400">
              Yapay zeka asistanının sizin üslubunuzda ve ilgi alanlarınıza uygun yazılar yazabilmesi için aşağıdaki soruları yanıtlayın.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">1. Genel olarak hangi konularda teknik yazılar yazmak istersiniz?</label>
                <textarea
                  value={answers.q1 || ''}
                  onChange={(e) => setAnswers({...answers, q1: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 min-h-[80px]"
                  placeholder="Örn: React, Node.js, AWS, Web Performansı..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">2. Hedef kitleniz kimlerden oluşuyor?</label>
                <textarea
                  value={answers.q2 || ''}
                  onChange={(e) => setAnswers({...answers, q2: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 min-h-[80px]"
                  placeholder="Örn: Orta seviye geliştiriciler, yazılıma yeni başlayanlar..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">3. Yazı üslubunuz nasıl olmalı?</label>
                <textarea
                  value={answers.q3 || ''}
                  onChange={(e) => setAnswers({...answers, q3: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 min-h-[80px]"
                  placeholder="Örn: Samimi ve öğretici ama çok kurumsal değil, aralarda espriler olabilir..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">4. Uzmanlık alanlarınız veya sektörünüz?</label>
                <textarea
                  value={answers.q4 || ''}
                  onChange={(e) => setAnswers({...answers, q4: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 min-h-[80px]"
                  placeholder="Örn: Full-Stack Web Geliştirme, SaaS Ürünleri..."
                />
              </div>
            </div>

            <button
              onClick={analyzePersona}
              disabled={analyzing}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium transition"
            >
              <Bot className="w-5 h-5" />
              {analyzing ? 'Analiz Ediliyor (Gemini AI)...' : 'Cevapları Analiz Et ve Kaydet'}
            </button>

            {settings?.toneOfVoice && (
              <div className="mt-8 p-6 bg-gray-800/50 border border-gray-700 rounded-xl space-y-4">
                <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                  <Check className="w-5 h-5" /> Çıkarılan Persona Profiliniz
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <span className="text-gray-400 text-sm block mb-1">Üslup (Tone of Voice)</span>
                    <p className="font-medium text-white">{settings.toneOfVoice}</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <span className="text-gray-400 text-sm block mb-1">İlgi Alanları (Interests)</span>
                    <p className="font-medium text-white">{settings.interests}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'settings' ? (
          <form onSubmit={saveSettings} className="space-y-6">
            <h2 className="text-xl font-bold">Otomasyon Ayarları</h2>
            
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
              <div>
                <h3 className="font-bold text-white">Sistemi Aktifleştir</h3>
                <p className="text-sm text-gray-400">Otomatik blog üretimi (Cron Job) çalışsın mı?</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings?.isActive || false}
                  onChange={(e) => setSettings({...settings, isActive: e.target.checked})}
                />
                <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Yayınlama Modu</label>
                <select
                  value={settings?.publishMode || 'draft'}
                  onChange={(e) => setSettings({...settings, publishMode: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                >
                  <option value="draft">Taslak Olarak Kaydet (Onay İste)</option>
                  <option value="auto_publish">Otomatik Yayına Al</option>
                </select>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <label className="block text-sm font-bold mb-4 text-white">Üretim Zamanlaması</label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Sıklık</label>
                    <select
                      value={settings?.scheduleCron?.endsWith('*') ? 'daily' : 'weekly'}
                      onChange={(e) => {
                        const isDaily = e.target.value === 'daily';
                        const parts = (settings?.scheduleCron || '0 9 * * 1').split(' ');
                        const newCron = `${parts[0]} ${parts[1]} * * ${isDaily ? '*' : '1'}`;
                        setSettings({...settings, scheduleCron: newCron});
                      }}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    >
                      <option value="daily">Her Gün</option>
                      <option value="weekly">Haftalık</option>
                    </select>
                  </div>
                  
                  {!(settings?.scheduleCron?.endsWith('*')) && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Gün</label>
                      <select
                        value={(settings?.scheduleCron || '0 9 * * 1').split(' ')[4]}
                        onChange={(e) => {
                          const parts = (settings?.scheduleCron || '0 9 * * 1').split(' ');
                          const newCron = `${parts[0]} ${parts[1]} * * ${e.target.value}`;
                          setSettings({...settings, scheduleCron: newCron});
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                      >
                        <option value="1">Pazartesi</option>
                        <option value="2">Salı</option>
                        <option value="3">Çarşamba</option>
                        <option value="4">Perşembe</option>
                        <option value="5">Cuma</option>
                        <option value="6">Cumartesi</option>
                        <option value="0">Pazar</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Saat</label>
                    <input
                      type="time"
                      value={(() => {
                        const parts = (settings?.scheduleCron || '0 9 * * 1').split(' ');
                        const h = parts[1]?.padStart(2, '0') || '09';
                        const m = parts[0]?.padStart(2, '0') || '00';
                        return `${h}:${m}`;
                      })()}
                      onChange={(e) => {
                        const [h, m] = e.target.value.split(':');
                        const parts = (settings?.scheduleCron || '0 9 * * 1').split(' ');
                        const newCron = `${parseInt(m)} ${parseInt(h)} * * ${parts[4] || '1'}`;
                        setSettings({...settings, scheduleCron: newCron});
                      }}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3 font-mono bg-gray-900 p-2 rounded">
                  Arka plan kodu: {settings?.scheduleCron || '0 9 * * 1'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Özel Prompt Kuralları (Sisteme Ek Emirler)</label>
              <textarea
                value={settings?.customPrompts || ''}
                onChange={(e) => setSettings({...settings, customPrompts: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 min-h-[120px] text-white"
                placeholder="Örn: Asla sonuç olarak, özetle gibi kelimeler kullanma. Metin içinde kalın puntolarla önemli teknik kelimeleri vurgula..."
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-gray-800 items-end">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition h-12"
              >
                Ayarları Kaydet
              </button>

              <div className="ml-auto flex gap-2 items-end w-full md:w-auto">
                <div className="flex-1 md:w-64">
                  <label className="block text-xs text-gray-400 mb-1">Spesifik Bir Konu Yaz (Opsiyonel)</label>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Örn: Next.js Server Actions"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white text-sm h-12"
                  />
                </div>
                <button
                  type="button"
                  onClick={triggerGeneration}
                  disabled={generating}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-medium transition flex items-center justify-center gap-2 h-12"
                >
                  <Play className="w-5 h-5" />
                  {generating ? 'Üretiliyor...' : t('tabManual')}
                </button>
              </div>
            </div>
          </form>
        ) : activeTab === 'calendar' ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">İçerik Takvimi (Blog Planning)</h2>
            <p className="text-gray-400 mb-6">
              Gelecek tarihlerde yapay zekanın yazmasını istediğiniz özel konuları buradan planlayabilirsiniz. Sistem kendi sırası geldiğinde önce buradaki planlı konulara bakar.
            </p>

            <form onSubmit={addPlan} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-800 rounded-xl border border-gray-700 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-gray-300">Yazılacak Konu</label>
                <input
                  type="text"
                  required
                  value={newPlanTopic}
                  onChange={(e) => setNewPlanTopic(e.target.value)}
                  placeholder="Örn: TypeScript'te Generics Kullanımı"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Tarih ve Saat</label>
                <input
                  type="datetime-local"
                  required
                  value={newPlanDate}
                  onChange={(e) => setNewPlanDate(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white [color-scheme:dark]"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition h-[50px]"
              >
                Planla
              </button>
            </form>

            <div className="mt-8">
              <h3 className="font-bold text-white mb-4">Bekleyen ve Tamamlanan Planlar</h3>
              {plans.length === 0 ? (
                <p className="text-gray-500 text-sm">Henüz eklenmiş bir plan bulunmuyor.</p>
              ) : (
                <div className="space-y-3">
                  {plans.map((plan: any) => (
                    <div key={plan.id} className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-white">{plan.topic}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs">
                          <span className="text-gray-400">
                            {new Date(plan.scheduledDate).toLocaleString('tr-TR')}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full ${
                            plan.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            plan.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {plan.status === 'pending' ? 'Bekliyor' :
                             plan.status === 'completed' ? 'Tamamlandı' : 'Hata'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deletePlan(plan.id)}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Temporary icon component for Check (since it's imported above)
function Check({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  );
}
