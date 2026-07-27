'use client';
import { useTranslations } from 'next-intl';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { ProjectItem } from '@/types';
import Link from 'next/link';
import { Plus, Edit2, Trash2, RefreshCw, ExternalLink, Star, Eye, Share2 } from 'lucide-react';

export default function AdminProjectsPage() {
  const t = useTranslations('Admin.projects');
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/projects');
      setItems(data.data || []);
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      alert(t('deleteError'));
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
            onClick={fetchProjects}
            className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-white transition"
            title="Yenile"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-gray-200 transition shadow-lg"
          >
            <Plus size={16} /> {t('newProject')}
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">{t('loading')}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-2xl text-gray-500 text-sm">
          {t('noProjects')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.sort((a,b) => b.queue - a.queue).map((item) => (
            <div key={item.id} className={`bg-gray-900 border rounded-2xl p-6 shadow-lg space-y-4 relative overflow-hidden ${item.isActive ? 'border-gray-800' : 'border-red-900/50 opacity-75'}`}>
              {!item.isActive && (
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] rounded font-bold">
                  {t('inactive')}
                </div>
              )}
              {item.isSignature && (
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] rounded font-bold flex items-center gap-1">
                  <Star size={10} /> {t('signature')}
                </div>
              )}
              
              <div className="flex items-start justify-between mt-4">
                <div>
                  <h3 className="font-bold text-base text-white font-heading">{item.title_tr}</h3>
                  <div className="text-xs text-gray-400 mt-1 line-clamp-2">{item.element_tr}</div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-3">
                    <span className="flex items-center gap-1 text-emerald-400 font-mono">
                      <Eye size={14} /> {item.views || 0}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-mono">
                      <Share2 size={14} /> {item.shares || 0}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Link
                    href={`/admin/projects/edit/${item.id}`}
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition"
                    title={t('edit')}
                  >
                    <Edit2 size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-950/50 hover:bg-red-900 text-red-400 hover:text-white rounded-lg transition"
                    title={t('delete')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {(item.button_url || item.demo_url) && (
                <div className="pt-3 border-t border-gray-800 flex items-center gap-3">
                  {item.button_url && (
                    <a href={item.button_url} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-gray-800 px-2 py-1 rounded text-gray-300 hover:text-white flex items-center gap-1">
                      <ExternalLink size={10} /> {t('reviewLink')}
                    </a>
                  )}
                  {item.demo_url && (
                    <a href={item.demo_url} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-blue-900/40 px-2 py-1 rounded text-blue-300 hover:text-white flex items-center gap-1">
                      <ExternalLink size={10} /> Demo
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
