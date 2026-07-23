'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslations } from 'next-intl';

export const ContactForm = () => {
  const t = useTranslations('Form');
  const tButtons = useTranslations('Buttons');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const isProd = process.env.NODE_ENV === 'production';
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProd && siteKey && !recaptchaToken) {
      toast.error(t('robot'));
      return;
    }

    setLoading(true);
    setStatus('idle');
    try {
      await api.post('/contact/send', { ...formData, recaptchaToken });
      setStatus('success');
      toast.success(t('successToast'));
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      const msg = err.response?.data?.message || 'Mesajınız gönderilirken bir hata oluştu.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 sm:p-10">
      <div className="mb-8">
        <h3 className="text-2xl font-bold font-heading mb-2">{t('title')}</h3>
        <p className="text-gray-600 text-sm">{t('subtitle')}</p>
      </div>

      {status === 'success' ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-4">
          <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
          <h4 className="text-emerald-700 font-bold text-lg">{t('successTitle')}</h4>
          <p className="text-emerald-600/80 text-sm">{t('successSubtitle')}</p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-4 px-6 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-sm font-bold transition"
          >
            {tButtons('sendNewMessage')}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('name')}</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition text-sm"
                placeholder={t('namePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('email')}</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition text-sm"
                placeholder={t('emailPlaceholder')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('subject')}</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition text-sm"
              placeholder={t('subjectPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('message')}</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition text-sm resize-none"
              placeholder={t('messagePlaceholder')}
            />
          </div>

          {status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {errorMessage}
            </div>
          )}

          {isProd && siteKey && (
            <div className="pt-2">
              <ReCAPTCHA
                sitekey={siteKey}
                onChange={(token) => setRecaptchaToken(token)}
              />
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-gray-800 text-white rounded-xl font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:-translate-y-0.5"
            >
              {loading ? tButtons('sending') : <><Send size={16} /> {tButtons('sendMessage')}</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
