'use client';
import { useTranslations } from 'next-intl';

import React, { useEffect, useState } from 'react';
import { api, getImageUrl } from '@/lib/api';
import type { AboutItem } from '@/types';
import { Plus, Edit2, Trash2, Save, X, RefreshCw, Upload, ImageIcon } from 'lucide-react';

export default function AdminAboutPage() {
  const t = useTranslations('Admin.about');
  const [items, setItems] = useState<AboutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);

  const [formData, setFormData] = useState({
    title_tr: '',
    title_en: '',
    title_de: '',
    title_ru: '',
    text_tr: '',
    text_en: '',
    text_de: '',
    text_ru: '',
    pp_url: '',
    cv_url: '',
  });

  const fetchAboutSections = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/about');
      setItems(data.data || []);
    } catch (err) {
      console.error('Error loading about data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutSections();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title_tr: '',
      title_en: '',
      title_de: '',
      title_ru: '',
      text_tr: '',
      text_en: '',
      text_de: '',
      text_ru: '',
      pp_url: '',
      cv_url: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: AboutItem) => {
    setEditingId(item.id);
    setFormData({
      title_tr: item.title_tr || '',
      title_en: item.title_en || '',
      title_de: item.title_de || '',
      title_ru: item.title_ru || '',
      text_tr: item.text_tr || '',
      text_en: item.text_en || '',
      text_de: item.text_de || '',
      text_ru: item.text_ru || '',
      pp_url: item.pp_url || '',
      cv_url: item.cv_url || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    try {
      await api.delete(`/about/${id}`);
      fetchAboutSections();
    } catch (err) {
      alert(t('deleteError'));
    }
  };

  const handleFileUpload = async (file: File) => {
    const data = new FormData();
    data.append('image', file);

    setUploadingImage(true);
    try {
      const res = await api.post('/images', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData({ ...formData, pp_url: getImageUrl(res.data.data.image_url) });
    } catch (err) {
      alert(t('uploadError'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCvUpload = async (file: File) => {
    const data = new FormData();
    data.append('document', file);

    setUploadingCv(true);
    try {
      const res = await api.post('/documents', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData({ ...formData, cv_url: res.data.url });
    } catch (err) {
      alert(t('errorCV'));
    } finally {
      setUploadingCv(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    } else if (file) {
      alert(t('errorImg'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/about/${editingId}`, formData);
      } else {
        await api.post('/about', formData);
      }
      setModalOpen(false);
      fetchAboutSections();
    } catch (err) {
      alert(t('errorSave'));
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-wider">{t('title')}</h1>
          <p className="text-xs text-gray-400 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAboutSections}
            className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-white transition"
            title="Yenile"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-gray-200 transition shadow-lg"
          >
            <Plus size={16} /> {t('addSection')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">{t('loading')}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-2xl text-gray-500 text-sm">
          {t('noAbout')}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row gap-6">
              {item.pp_url && (
                <img
                  src={item.pp_url}
                  alt="Profil"
                  className="w-24 h-24 rounded-2xl object-cover border border-gray-700 shrink-0"
                />
              )}
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-white font-heading">{item.title_tr}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition"
                      title={t('edit')}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-950/50 hover:bg-red-900 text-red-400 hover:text-white rounded-lg transition"
                      title={t('delete')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">{item.text_tr}</p>
                <div className="flex gap-2 text-[10px] text-gray-500 font-mono pt-2 border-t border-gray-800">
                  <span>TR: {item.title_tr}</span> · <span>EN: {item.title_en}</span> · <span>DE: {item.title_de}</span> · <span>RU: {item.title_ru}</span>
                </div>
                {item.cv_url && (
                  <div className="text-xs text-blue-400 font-bold mt-2">
                    <a href={item.cv_url} target="_blank" rel="noopener noreferrer"> {t('cvUploaded')} </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <h2 className="font-heading font-bold text-lg">
                {editingId ? t('editSection') : t('newSection')}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="block text-gray-400 mb-1 font-semibold uppercase flex items-center gap-2">
                  <ImageIcon size={16} /> {t('profilePic')}
                </label>
                
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-700 hover:border-white rounded-2xl p-6 text-center bg-gray-950/60 transition cursor-pointer flex flex-col items-center justify-center min-h-[140px] relative"
                >
                  {formData.pp_url ? (
                    <div className="relative group w-32 h-32 rounded-xl overflow-hidden border border-gray-700 mx-auto">
                      <img src={formData.pp_url} alt="Kapak" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs text-white font-bold text-center p-2">
                        Değiştirmek İçin Tıkla/Bırak
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mx-auto text-gray-400">
                        <Upload size={20} />
                      </div>
                      <div className="text-xs text-gray-300">
                        {t('dragImage')}
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
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-xs text-emerald-400 font-mono rounded-2xl">
                      Yükleniyor...
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  value={formData.pp_url || ''}
                  onChange={(e) => setFormData({ ...formData, pp_url: e.target.value })}
                  placeholder={t('placeholderImg')}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white mt-2"
                />
              </div>

              <div className="space-y-2 border-t border-gray-800 pt-4">
                <label className="block text-gray-400 mb-1 font-semibold uppercase flex items-center gap-2">
                  <Upload size={16} /> {t('cvFile')}
                </label>
                
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleCvUpload(file);
                  }}
                  className="border-2 border-dashed border-gray-700 hover:border-white rounded-2xl p-6 text-center bg-gray-950/60 transition cursor-pointer flex flex-col items-center justify-center min-h-[100px] relative"
                >
                  {formData.cv_url ? (
                    <div className="space-y-2">
                      <div className="text-emerald-400 font-bold">{t('cvLoaded')}</div>
                      <a href={formData.cv_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline z-10 relative">{t('view')}</a>
                      <div className="text-xs text-gray-400 mt-2">{t('dragNewCv')}</div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => e.target.files?.[0] && handleCvUpload(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mx-auto text-gray-400">
                        <Upload size={20} />
                      </div>
                      <div className="text-xs text-gray-300">
                        {t('dragPdf')}
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => e.target.files?.[0] && handleCvUpload(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                  {uploadingCv && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-xs text-blue-400 font-mono rounded-2xl">
                      CV Yükleniyor...
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  value={formData.cv_url || ''}
                  onChange={(e) => setFormData({ ...formData, cv_url: e.target.value })}
                  placeholder={t('placeholderCv')}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold uppercase">{t('titleTr')}</label>
                  <input
                    type="text"
                    required
                    value={formData.title_tr}
                    onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold uppercase">{t('titleEn')}</label>
                  <input
                    type="text"
                    required
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold uppercase">{t('titleDe')}</label>
                  <input
                    type="text"
                    required
                    value={formData.title_de}
                    onChange={(e) => setFormData({ ...formData, title_de: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold uppercase">{t('titleRu')}</label>
                  <input
                    type="text"
                    required
                    value={formData.title_ru}
                    onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold uppercase">{t('descTr')}</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.text_tr}
                    onChange={(e) => setFormData({ ...formData, text_tr: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold uppercase">{t('descEn')}</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.text_en}
                    onChange={(e) => setFormData({ ...formData, text_en: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold uppercase">{t('descDe')}</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.text_de}
                    onChange={(e) => setFormData({ ...formData, text_de: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold uppercase">{t('descRu')}</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.text_ru}
                    onChange={(e) => setFormData({ ...formData, text_ru: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition flex items-center gap-2"
                >
                  <Save size={16} /> {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
