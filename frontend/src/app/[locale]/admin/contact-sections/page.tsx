'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Plus, Edit2, Trash2, Link as LinkIcon, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

interface ContactSection {
  id: string;
  icon: string;
  title_tr: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  button_url: string;
  isActive: boolean;
}

export default function ContactSectionsAdmin() {
  const [sections, setSections] = useState<ContactSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    icon: 'MessageCircle', // Default icon name
    title_tr: '',
    title_en: '',
    title_de: '',
    title_ru: '',
    button_url: '',
    isActive: true,
  });

  const fetchSections = async () => {
    try {
      const { data } = await api.get('/contact-sections');
      setSections(data.data || []);
    } catch (err) {
      toast.error('Butonlar yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/contact-sections/${editingId}`, formData);
        toast.success('Buton başarıyla güncellendi.');
      } else {
        await api.post('/contact-sections', formData);
        toast.success('Yeni buton eklendi.');
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchSections();
    } catch (err) {
      toast.error('İşlem sırasında bir hata oluştu.');
    }
  };

  const handleEdit = (section: ContactSection) => {
    setFormData({
      icon: section.icon,
      title_tr: section.title_tr,
      title_en: section.title_en,
      title_de: section.title_de,
      title_ru: section.title_ru,
      button_url: section.button_url,
      isActive: section.isActive,
    });
    setEditingId(section.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu butonu silmek istediğinize emin misiniz?')) {
      try {
        await api.delete(`/contact-sections/${id}`);
        toast.success('Buton silindi.');
        fetchSections();
      } catch (err) {
        toast.error('Silinirken hata oluştu.');
      }
    }
  };

  const toggleActive = async (section: ContactSection) => {
    try {
      await api.put(`/contact-sections/${section.id}`, { isActive: !section.isActive });
      toast.success('Durum güncellendi.');
      fetchSections();
    } catch (err) {
      toast.error('Durum güncellenirken hata oluştu.');
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({
      icon: 'MessageCircle',
      title_tr: '',
      title_en: '',
      title_de: '',
      title_ru: '',
      button_url: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold font-heading">Özel İletişim Butonları</h1>
          <p className="text-xs text-gray-400 mt-1">Ana sayfada ve menüde görünecek özel bağlantı butonlarınızı (WhatsApp, Telegram vb.) buradan yönetebilirsiniz.</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition text-sm"
        >
          <Plus size={16} /> Yeni Buton Ekle
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Yükleniyor...</div>
      ) : (
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 border-b border-gray-800 text-xs uppercase tracking-wider text-gray-400">
                <th className="p-4 font-semibold">İkon</th>
                <th className="p-4 font-semibold">Başlık (TR)</th>
                <th className="p-4 font-semibold">Bağlantı URL</th>
                <th className="p-4 font-semibold">Durum</th>
                <th className="p-4 font-semibold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {sections.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Henüz hiç buton eklenmemiş.
                  </td>
                </tr>
              )}
              {sections.map((section) => (
                <tr key={section.id} className="hover:bg-gray-800/50 transition">
                  <td className="p-4 font-mono text-xs text-gray-300">{section.icon}</td>
                  <td className="p-4 font-semibold text-white">{section.title_tr}</td>
                  <td className="p-4 text-blue-400">
                    <a href={section.button_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                      <LinkIcon size={14} /> Link
                    </a>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(section)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                        section.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {section.isActive ? 'Aktif' : 'Pasif'}
                    </button>
                  </td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(section)}
                      className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                      title="Düzenle"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="p-2 text-gray-400 hover:text-red-400 bg-gray-800 hover:bg-red-500/20 rounded-lg transition"
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur z-10">
              <h3 className="text-xl font-bold font-heading">
                {editingId ? 'Butonu Düzenle' : 'Yeni Buton Ekle'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">İkon Adı (Lucide React)</label>
                <input
                  type="text"
                  required
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white transition"
                  placeholder="Örn: MessageCircle, Send, Phone"
                />
                <p className="text-xs text-gray-500">İkon isimleri için <a href="https://lucide.dev/icons" target="_blank" className="text-blue-400 hover:underline">lucide.dev</a> sitesine bakabilirsiniz.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bağlantı (URL)</label>
                <input
                  type="url"
                  required
                  value={formData.button_url}
                  onChange={(e) => setFormData({ ...formData, button_url: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white transition"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Başlık (TR)</label>
                  <input
                    type="text"
                    required
                    value={formData.title_tr}
                    onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Başlık (EN)</label>
                  <input
                    type="text"
                    required
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Başlık (DE)</label>
                  <input
                    type="text"
                    required
                    value={formData.title_de}
                    onChange={(e) => setFormData({ ...formData, title_de: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Başlık (RU)</label>
                  <input
                    type="text"
                    required
                    value={formData.title_ru}
                    onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-white transition"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition flex items-center gap-2"
                >
                  <Save size={18} /> Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
