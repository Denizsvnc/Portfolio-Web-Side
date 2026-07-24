'use client';
import { useTranslations } from 'next-intl';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ArrowLeft, Save, Upload, Link as LinkIcon, Paperclip, Code, Star } from 'lucide-react';

export default function NewProjectPage() {
  const t = useTranslations('Admin.projectsNew');
  const router = useRouter();

  const [activeLangTab, setActiveLangTab] = useState<'tr' | 'en' | 'de' | 'ru'>('tr');
  const [saving, setSaving] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);

  const [formData, setFormData] = useState({
    icon: 'folder',
    title_tr: '',
    title_en: '',
    title_de: '',
    title_ru: '',
    element_tr: '',
    element_en: '',
    element_de: '',
    element_ru: '',
    innovation_tr: '',
    innovation_en: '',
    innovation_de: '',
    innovation_ru: '',
    tech_stack: '',
    button_url: '',
    demo_url: '',
    isSignature: false,
    queue: 0,
    isActive: true,
    attachments: [] as { title: string; url: string }[],
    links: [] as { title: string; url: string }[],
  });

  const handleDocumentUpload = async (file: File) => {
    setUploadingDocument(true);
    const uploadData = new FormData();
    uploadData.append('document', file);

    try {
      const { data } = await api.post('/documents', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = data.url;
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, { title: file.name, url }],
      }));
    } catch (err) {
      alert('Dosya yüklenirken bir hata oluştu.');
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleDocumentDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach((file) => handleDocumentUpload(file));
    }
  };

  const insertParagraphDelimiter = (fieldPrefix: 'element' | 'innovation') => {
    const fieldName = `${fieldPrefix}_${activeLangTab}` as keyof typeof formData;
    const currentText = (formData[fieldName] as string) || '';
    const updatedText = currentText ? `${currentText}\n\n/******/\n\n` : `/******/\n\n`;
    setFormData({ ...formData, [fieldName]: updatedText });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    try {
      await api.post('/projects', formData);
      router.push('/admin/projects');
    } catch (err) {
      alert('Proje kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-5">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/projects"
            className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-heading tracking-wider">{t('title')}</h1>
            <p className="text-xs text-gray-400">Detaylı içerik, ek dosyalar ve dış kaynak bağlantıları ile proje oluşturun</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold text-xs rounded-xl hover:bg-gray-200 transition shadow-lg disabled:opacity-50"
        >
          <Save size={16} /> {saving ? t('saving') : t('saveAndPublish')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        
        {/* General Settings */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="font-heading font-bold text-sm text-gray-200 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
            Genel Ayarlar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold uppercase">İkon (Lucide)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="folder, star, vb."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-semibold uppercase">Kullanılan Teknolojiler</label>
              <input
                type="text"
                value={formData.tech_stack}
                onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                placeholder="React, Node.js..."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-semibold uppercase">Sıra (Queue)</label>
              <input
                type="number"
                value={formData.queue}
                onChange={(e) => setFormData({ ...formData, queue: Number(e.target.value) })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-semibold uppercase">GitHub/İncele {t('linkUrl')}</label>
              <input
                type="text"
                value={formData.button_url}
                onChange={(e) => setFormData({ ...formData, button_url: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-semibold uppercase">{t('demoUrl')}</label>
              <input
                type="text"
                value={formData.demo_url}
                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
              />
            </div>
            <div className="flex items-center gap-4 mt-6">
              <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.isSignature}
                  onChange={(e) => setFormData({ ...formData, isSignature: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-800 bg-gray-950 text-emerald-500 focus:ring-emerald-500"
                />
                <Star size={16} className={formData.isSignature ? "text-yellow-400" : "text-gray-500"} /> İmza Projesi
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-800 bg-gray-950 text-emerald-500 focus:ring-emerald-500"
                />
                Aktif (Göster)
              </label>
            </div>
          </div>
        </div>

        {/* Content Tabs (TR, EN, DE, RU) */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div className="flex items-center gap-2">
              {(['tr', 'en', 'de', 'ru'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-4 py-2 rounded-xl font-heading text-xs font-bold uppercase transition ${
                    activeLangTab === lang
                      ? 'bg-white text-black shadow-md'
                      : 'bg-gray-950 text-gray-400 hover:text-white border border-gray-800'
                  }`}
                >
                  {lang === 'tr' ? 'Türkçe' : lang === 'en' ? 'English' : lang === 'de' ? 'Deutsch' : 'Русский'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold uppercase">
                {t('projectTitle')} ({activeLangTab.toUpperCase()})
              </label>
              <input
                type="text"
                required
                value={formData[`title_${activeLangTab}` as keyof typeof formData] as string}
                onChange={(e) => setFormData({ ...formData, [`title_${activeLangTab}`]: e.target.value })}
                placeholder="{t('projectTitle')}..."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3.5 text-sm text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-gray-400 font-semibold uppercase">
                  Proje Açıklaması ({activeLangTab.toUpperCase()})
                </label>
                <button
                  type="button"
                  onClick={() => insertParagraphDelimiter('element')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-lg text-[10px] font-mono transition"
                >
                  <Code size={12} /> Paragraf Sonu {t('add')}
                </button>
              </div>
              <textarea
                rows={6}
                required
                value={formData[`element_${activeLangTab}` as keyof typeof formData] as string}
                onChange={(e) => setFormData({ ...formData, [`element_${activeLangTab}`]: e.target.value })}
                placeholder="Proje detaylarını buraya yazın..."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm text-white outline-none focus:border-white leading-relaxed font-sans"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-gray-400 font-semibold uppercase">
                  İnovasyon & Özellikler ({activeLangTab.toUpperCase()})
                </label>
                <button
                  type="button"
                  onClick={() => insertParagraphDelimiter('innovation')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-lg text-[10px] font-mono transition"
                >
                  <Code size={12} /> Paragraf Sonu {t('add')}
                </button>
              </div>
              <textarea
                rows={4}
                value={formData[`innovation_${activeLangTab}` as keyof typeof formData] as string}
                onChange={(e) => setFormData({ ...formData, [`innovation_${activeLangTab}`]: e.target.value })}
                placeholder="Yenilikçi özellikleri veya ekstra detayları yazın..."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm text-white outline-none focus:border-white leading-relaxed font-sans"
              />
            </div>
          </div>
        </div>

        {/* Attachments & Resource Links */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg space-y-6">
          
          {/* Documents */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-gray-200 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2"><Paperclip size={18} className="text-blue-400" /> Ek Dosyalar</span>
              <span className="text-[10px] text-gray-400 font-mono font-normal normal-case">Sürükle bırak yapabilirsiniz</span>
            </h3>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDocumentDrop}
              className="border-2 border-dashed border-gray-700 hover:border-blue-400 rounded-xl p-6 text-center bg-gray-950/40 transition cursor-pointer flex flex-col items-center justify-center relative min-h-[100px]"
            >
              {uploadingDocument ? (
                <div className="text-blue-400 font-mono">Dosya Yükleniyor...</div>
              ) : (
                <>
                  <div className="text-gray-400 mb-2"><Upload size={20} className="mx-auto" /></div>
                  <div className="text-gray-300">Dosyaları buraya sürükleyin veya seçin</div>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => e.target.files && Array.from(e.target.files).forEach(handleDocumentUpload)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>

            {formData.attachments.length > 0 && (
              <div className="space-y-2 mt-4">
                {formData.attachments.map((att, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-gray-950 p-2 rounded-lg border border-gray-800">
                    <input
                      type="text"
                      value={att.title}
                      onChange={(e) => {
                        const newAtts = [...formData.attachments];
                        newAtts[idx].title = e.target.value;
                        setFormData({ ...formData, attachments: newAtts });
                      }}
                      placeholder="Başlık (örn: Sunum Dosyası)"
                      className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white outline-none flex-1"
                    />
                    <input
                      type="text"
                      value={att.url}
                      disabled
                      className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-500 outline-none flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attachments: formData.attachments.filter((_, i) => i !== idx) })}
                      className="text-red-400 hover:text-red-300 px-3"
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="border-gray-800" />

          {/* Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <LinkIcon size={18} className="text-purple-400" /> Dış Kaynak Bağlantıları
              </h3>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, links: [...formData.links, { title: '', url: '' }] })}
                className="text-purple-400 hover:text-purple-300 font-mono uppercase font-semibold"
              >
                + Yeni Bağlantı {t('add')}
              </button>
            </div>

            {formData.links.length > 0 ? (
              <div className="space-y-2">
                {formData.links.map((link, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-gray-950 p-2 rounded-lg border border-gray-800">
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => {
                        const newLinks = [...formData.links];
                        newLinks[idx].title = e.target.value;
                        setFormData({ ...formData, links: newLinks });
                      }}
                      placeholder="Başlık (örn: Kaynak Kodları)"
                      className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white outline-none flex-1"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...formData.links];
                        newLinks[idx].url = e.target.value;
                        setFormData({ ...formData, links: newLinks });
                      }}
                      placeholder="{t('linkUrl')} (https://...)"
                      className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white outline-none flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, links: formData.links.filter((_, i) => i !== idx) })}
                      className="text-red-400 hover:text-red-300 px-3"
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic text-center py-4 bg-gray-950 rounded-xl border border-dashed border-gray-800">
                Henüz bağlantı eklenmemiş.
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
