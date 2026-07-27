'use client';
import { useTranslations } from 'next-intl';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { ImageItem } from '@/types';
import { ArrowLeft, Save, Upload, Image as ImageIcon, Link as LinkIcon, Paperclip, Check, Code } from 'lucide-react';

export default function NewBlogPage() {
  const t = useTranslations('Admin.blogsNew');
  const router = useRouter();

  const [activeLangTab, setActiveLangTab] = useState<'tr' | 'en' | 'de' | 'ru'>('tr');
  const [galleryImages, setGalleryImages] = useState<ImageItem[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    icon: 'book-open',
    img_url: '',
    title_tr: '',
    title_en: '',
    title_de: '',
    title_ru: '',
    description_tr: '',
    description_en: '',
    description_de: '',
    description_ru: '',
    attachments: [] as { title: string; url: string }[],
    links: [] as { title: string; url: string }[],
    queue: 0,
    isActive: true,
  });

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get('/images');
        setGalleryImages(data.data || []);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      }
    };
    fetchGallery();
  }, []);

  const handleFileUpload = async (file: File) => {
    setUploadingImage(true);
    const uploadData = new FormData();
    uploadData.append('image', file);
    uploadData.append('alt_text', formData.title_tr || 'Blog Cover Image');

    try {
      const { data } = await api.post('/images', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedUrl = data.data.image_url.startsWith('http')
        ? data.data.image_url
        : `http://127.0.0.1:2006${data.data.image_url}`;

      setFormData((prev) => ({ ...prev, img_url: uploadedUrl }));
    } catch (err) {
      alert(t('errorImg'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const [uploadingDocument, setUploadingDocument] = useState(false);
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
      alert(t('errorFile'));
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

  const insertParagraphDelimiter = () => {
    const fieldName = `description_${activeLangTab}` as keyof typeof formData;
    const currentText = (formData[fieldName] as string) || '';
    const updatedText = currentText ? `${currentText}\n\n/******/\n\n` : `/******/\n\n`;
    setFormData({ ...formData, [fieldName]: updatedText });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.img_url) {
      alert(t('errorCover'));
      return;
    }

    setSaving(true);
    try {
      await api.post('/blogs', formData);
      router.push('/admin/blogs');
    } catch (err) {
      alert(t('errorSave'));
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
            href="/admin/blogs"
            className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-heading tracking-wider">{t('title')}</h1>
            <p className="text-xs text-gray-400">{t('subtitle')}</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold text-xs rounded-xl hover:bg-gray-200 transition shadow-lg disabled:opacity-50"
        >
          <Save size={16} /> {saving ? t('savingBtn') : t('saveBtn')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Cover Image Drag & Drop Uploader */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-heading font-bold text-sm text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={18} className="text-emerald-400" /> {t('coverImg')}
            </label>
            <button
              type="button"
              onClick={() => setShowGallery(!showGallery)}
              className="text-xs text-blue-400 hover:underline font-mono"
            >
              {showGallery ? t('closeGallery') : t('openGallery')}
            </button>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-700 hover:border-white rounded-2xl p-8 text-center bg-gray-950/60 transition cursor-pointer flex flex-col items-center justify-center min-h-[160px] relative"
          >
            {formData.img_url ? (
              <div className="relative group w-full max-w-md h-48 rounded-xl overflow-hidden border border-gray-700">
                <img src={formData.img_url} alt="Kapak" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs text-white font-bold">
                  Resmi Değiştirmek İçin Dosya Bırakın
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto text-gray-400">
                  <Upload size={24} />
                </div>
                <div className="text-xs text-gray-300">
                  {t('dragImgStr')}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            )}
            {uploadingImage && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-xs text-emerald-400 font-mono">
                WebP Dönüştürülüyor...
              </div>
            )}
          </div>

          {/* Gallery Picker Drawer */}
          {showGallery && (
            <div className="pt-4 border-t border-gray-800 space-y-3">
              <span className="text-xs text-gray-400 font-semibold uppercase">{t('systemImgs')}</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-48 overflow-y-auto p-2 bg-gray-950 rounded-xl border border-gray-800">
                {galleryImages.map((img) => {
                  const url = img.image_url.startsWith('http') ? img.image_url : `http://127.0.0.1:2006${img.image_url}`;
                  return (
                    <div
                      key={img.id}
                      onClick={() => {
                        setFormData({ ...formData, img_url: url });
                        setShowGallery(false);
                      }}
                      className="relative h-20 rounded-lg overflow-hidden border border-gray-800 hover:border-emerald-400 cursor-pointer group"
                    >
                      <img src={url} alt="Galeri" className="w-full h-full object-cover group-hover:scale-105 transition" />
                      {formData.img_url === url && (
                        <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center text-white">
                          <Check size={20} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
                  className={`px-4 py-2 rounded-xl font-heading text-xs font-bold uppercase transition ${activeLangTab === lang
                    ? 'bg-white text-black shadow-md'
                    : 'bg-gray-950 text-gray-400 hover:text-white border border-gray-800'
                    }`}
                >
                  {lang === 'tr' ? t('langTr') : lang === 'en' ? t('langEn') : lang === 'de' ? t('langDe') : t('langRu')}
                </button>
              ))}
            </div>

            {/* Paragraph Delimiter Helper Button */}
            <button
              type="button"
              onClick={insertParagraphDelimiter}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-lg text-xs font-mono transition"
              title={t('addPara')}
            >
              <Code size={14} /> Paragraf Sonu (/******/) Ekle
            </button>
          </div>

          {/* Tab Content Fields */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold uppercase">
                {t('blogTitle')} ({activeLangTab.toUpperCase()})
              </label>
              <input
                type="text"
                required
                value={formData[`title_${activeLangTab}` as keyof typeof formData] as string}
                onChange={(e) => setFormData({ ...formData, [`title_${activeLangTab}`]: e.target.value })}
                placeholder={t('titlePl')}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3.5 text-sm text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold uppercase flex items-center justify-between">
                <span>{t('blogContent')} ({activeLangTab.toUpperCase()})</span>
                <span className="text-[10px] text-amber-400 font-mono">
                  Paragraf bölmek için <code>/******/</code> kullanabilirsiniz
                </span>
              </label>
              <textarea
                rows={12}
                required
                value={formData[`description_${activeLangTab}` as keyof typeof formData] as string}
                onChange={(e) => setFormData({ ...formData, [`description_${activeLangTab}`]: e.target.value })}
                placeholder="Makale içeriğini buraya yazın... Paragraf sonu için /******/ simgesini kullanabilirsiniz."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm text-white outline-none focus:border-white leading-relaxed font-sans"
              />
            </div>
          </div>
        </div>

        {/* Attachments & Resource Links */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg space-y-6 text-xs">

          {/* Documents */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-gray-200 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2"><Paperclip size={18} className="text-blue-400" /> Ek Dosyalar</span>
              <span className="text-[10px] text-gray-400 font-mono font-normal normal-case">{t('dragDrop')}</span>
            </h3>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDocumentDrop}
              className="border-2 border-dashed border-gray-700 hover:border-blue-400 rounded-xl p-6 text-center bg-gray-950/40 transition cursor-pointer flex flex-col items-center justify-center relative min-h-[100px]"
            >
              {uploadingDocument ? (
                <div className="text-blue-400 font-mono">{t('loadingFile')}</div>
              ) : (
                <>
                  <div className="text-gray-400 mb-2"><Upload size={20} className="mx-auto" /></div>
                  <div className="text-gray-300">{t('dragFiles')}</div>
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
                      placeholder={t('docPl')}
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
                    >{t('delete')}</button>
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
                <LinkIcon size={18} className="text-purple-400" /> {t('extLinks')}
              </h3>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, links: [...formData.links, { title: '', url: '' }] })}
                className="text-purple-400 hover:text-purple-300 font-mono uppercase font-semibold"
              >
                + {t('addLink')}
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
                      placeholder={t('linkPl')}
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
                      placeholder="URL (https://...)"
                      className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white outline-none flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, links: formData.links.filter((_, i) => i !== idx) })}
                      className="text-red-400 hover:text-red-300 px-3"
                    >{t('delete')}</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic text-center py-4 bg-gray-950 rounded-xl border border-dashed border-gray-800">
                {t('noLinks')}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
