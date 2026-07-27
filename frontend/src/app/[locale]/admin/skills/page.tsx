'use client';
import { useTranslations } from 'next-intl';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { SkillItem } from '@/types';
import { Plus, Edit2, Trash2, Save, X, RefreshCw, Code2 } from 'lucide-react';

export default function AdminSkillsPage() {
  const t = useTranslations('Admin.skills');
  const [items, setItems] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    icon: 'code',
    title_tr: '',
    title_en: '',
    title_de: '',
    title_ru: '',
    element_tr: '',
    element_en: '',
    element_de: '',
    element_ru: '',
    is_active: true,
  });

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/skills');
      setItems(data.data || []);
    } catch (err) {
      console.error('Error loading skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      icon: 'code',
      title_tr: '',
      title_en: '',
      title_de: '',
      title_ru: '',
      element_tr: '',
      element_en: '',
      element_de: '',
      element_ru: '',
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: SkillItem) => {
    setEditingId(item.id);
    setFormData({
      icon: item.icon || 'code',
      title_tr: item.title_tr || '',
      title_en: item.title_en || '',
      title_de: item.title_de || '',
      title_ru: item.title_ru || '',
      element_tr: item.element_tr || '',
      element_en: item.element_en || '',
      element_de: item.element_de || '',
      element_ru: item.element_ru || '',
      is_active: item.is_active ?? true,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    try {
      await api.delete(`/skills/${id}`);
      fetchSkills();
    } catch (err) {
      alert(t('deleteError'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/skills/${editingId}`, formData);
      } else {
        await api.post('/skills', formData);
      }
      setModalOpen(false);
      fetchSkills();
    } catch (err) {
      alert(t('saveError'));
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
            onClick={fetchSkills}
            className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-white transition"
            title="Yenile"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-gray-200 transition shadow-lg"
          >
            <Plus size={16} /> Yeni Yetenek Ekle
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">{t('loading')}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-2xl text-gray-500 text-sm">
          {t('noSkills')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold">
                    <Code2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white font-heading">{item.title_tr}</h3>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{t('iconStr')} {item.icon}</span>
                  </div>
                </div>
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
              <p className="text-xs text-gray-300 bg-gray-950/60 p-3 rounded-xl border border-gray-800/80">
                {item.element_tr}
              </p>
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
                {editingId ? t('editSkill') : t('newSkill')}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold uppercase">{t('iconName')}</label>
                <p className="text-[10px] text-gray-500 mb-2">
                  {t('iconInfo')} <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Lucide Icons</a> (örn: <code>code</code>, <code>server</code>, <code>database</code>)
                </p>
                <input
                  type="text"
                  required
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="code, server, tools vb."
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
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
                  <label className="block text-gray-400 mb-1 font-semibold uppercase">Teknolojiler (TR)</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.element_tr}
                    onChange={(e) => setFormData({ ...formData, element_tr: e.target.value })}
                    placeholder="HTML5, React, TailwindCSS..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold uppercase">Teknolojiler (EN)</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.element_en}
                    onChange={(e) => setFormData({ ...formData, element_en: e.target.value })}
                    placeholder="HTML5, React, TailwindCSS..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold uppercase">Teknolojiler (DE)</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.element_de}
                    onChange={(e) => setFormData({ ...formData, element_de: e.target.value })}
                    placeholder="HTML5, React, TailwindCSS..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold uppercase">Teknolojiler (RU)</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.element_ru}
                    onChange={(e) => setFormData({ ...formData, element_ru: e.target.value })}
                    placeholder="HTML5, React, TailwindCSS..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold"
                > {t('cancel')}
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
