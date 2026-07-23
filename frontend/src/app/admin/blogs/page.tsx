'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { BlogItem } from '@/types';
import { Plus, Edit2, Trash2, RefreshCw, Eye, Share2 } from 'lucide-react';

export default function AdminBlogsPage() {
  const [items, setItems] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/blogs');
      setItems(data.data || []);
    } catch (err) {
      console.error('Error loading blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      alert('Silinirken hata oluştu.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-wider">BLOG YAZILARI YÖNETİMİ</h1>
          <p className="text-xs text-gray-400 mt-1">Blog içeriklerinin, okunma ve paylaşılma sayaçlarının yönetimi</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchBlogs}
            className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-white transition"
            title="Yenile"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-gray-200 transition shadow-lg"
          >
            <Plus size={16} /> Yeni Blog Yazısı Ekle
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-2xl text-gray-500 text-sm">
          Henüz blog yazısı eklenmemiş.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg space-y-4">
              {item.img_url && (
                <img
                  src={item.img_url}
                  alt={item.title_tr}
                  className="w-full h-40 object-cover rounded-xl border border-gray-800"
                />
              )}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white font-heading">{item.title_tr}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1 text-emerald-400 font-mono">
                      <Eye size={14} /> {item.views} okunma
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-mono">
                      <Share2 size={14} /> {item.shares} paylaşım
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-950/50 hover:bg-red-900 text-red-400 hover:text-white rounded-lg transition"
                    title="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-300 line-clamp-2">{item.description_tr}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
