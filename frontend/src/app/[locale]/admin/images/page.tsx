'use client';
import { useTranslations } from 'next-intl';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { ImageItem } from '@/types';
import { Upload, Trash2, Copy, Check, RefreshCw, Image as ImageIcon } from 'lucide-react';

export default function AdminImagesPage() {
  const t = useTranslations('Admin.images');
  const [items, setItems] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/images');
      setItems(data.data || []);
    } catch (err) {
      console.error('Error loading images:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert(t('selectImageWarning'));
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    if (altText) formData.append('alt_text', altText);

    try {
      await api.post('/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSelectedFile(null);
      setAltText('');
      fetchImages();
    } catch (err) {
      alert(t('uploadError'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    try {
      await api.delete(`/images/${id}`);
      fetchImages();
    } catch (err) {
      alert(t('deleteError'));
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = url.startsWith('http') ? url : `http://localhost:3005${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-wider">{t('title')}</h1>
          <p className="text-xs text-gray-400 mt-1">{t('subtitle')}</p>
        </div>
        <button
          onClick={fetchImages}
          className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-white transition self-start sm:self-auto"
          title="Yenile"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Upload Box */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="font-heading font-bold text-base mb-4 flex items-center gap-2">
          <Upload size={18} className="text-emerald-400" /> {t('uploadTitle')}
        </h3>

        <form onSubmit={handleUpload} className="flex flex-col md:flex-row items-stretch md:items-center gap-4 text-xs">
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="flex-1 bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-white text-xs file:bg-white file:text-black file:border-0 file:rounded-lg file:px-3 file:py-1 file:font-semibold file:mr-3"
          />
          <input
            type="text"
            placeholder={t('altPlaceholder')}
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="md:w-64 bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
          />
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-3 bg-white text-black font-semibold text-xs rounded-xl hover:bg-gray-200 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? t('converting') : t('uploadBtn') + ' ' + t('makeWebp')}
          </button>
        </form>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">{t('loadingImages')}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-2xl text-gray-500 text-sm">
          {t('noImages')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const displayUrl = item.image_url.startsWith('http')
              ? item.image_url
              : `http://localhost:3005${item.image_url}`;

            return (
              <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg group">
                <div className="relative h-48 bg-gray-950 flex items-center justify-center">
                  <img
                    src={displayUrl}
                    alt={item.alt_text || t('defaultAlt')}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-md rounded text-[10px] font-mono text-emerald-400 font-bold">
                    WebP
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div className="text-xs text-gray-300 font-medium truncate">
                    {item.alt_text || t('noDescription')}
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono truncate">{item.image_url}</div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                    <button
                      onClick={() => handleCopyUrl(item.image_url, item.id)}
                      className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check size={14} className="text-emerald-400" /> {t('copied')}
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> {t('copyUrl')}
                        </>
                      )}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
