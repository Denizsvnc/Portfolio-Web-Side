'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import type { BlogItem } from '@/types';
import { ParagraphRenderer } from '@/components/common/ParagraphRenderer';
import { ShareMenu } from '@/components/common/ShareMenu';
import { Sidebar } from '@/components/public/Sidebar';
import { ArrowLeft, Eye, Share2, Calendar, Paperclip, ExternalLink } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function BlogDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [aboutList, setAboutList] = useState<any[]>([]);
  const lang = useLocale();
  const tButtons = useTranslations('Buttons');
  const tStatus = useTranslations('Status');
  const tTitles = useTranslations('Titles');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBlogDetail = async () => {
      try {
        const [blogRes, aboutRes] = await Promise.all([
          api.get(`/blogs/${id}`),
          api.get('/about').catch(() => ({ data: { data: [] } }))
        ]);
        setBlog(blogRes.data.data);
        setAboutList(aboutRes.data.data || []);
      } catch (err) {
        setError('Blog yazısı yüklenirken bir hata oluştu veya yazı bulunamadı.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [id]);

  const refreshBlog = async () => {
    try {
      const { data } = await api.get(`/blogs/${id}`);
      setBlog(data.data);
    } catch (err) {
      console.error('Error refreshing blog:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-sm font-mono text-gray-500">
        {tStatus('loading')}
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <p className="text-red-500 font-semibold text-sm">{error || tStatus('noBlogs')}</p>
        <Link href={`/${lang}`} className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition">
          {tButtons('backToPortfolio')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      {/* Sidebar */}
      <Sidebar currentLang={lang} profileImg={aboutList[0]?.pp_url} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[280px] px-6 sm:px-12 py-12 max-w-4xl mx-auto w-full space-y-8">
        <Link
          href={`/${lang}/blogs`}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> {tTitles('allBlogs')}
        </Link>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold font-heading tracking-tight text-gray-900">{blog[`title_${lang}` as keyof BlogItem] as string || blog.title_tr}</h1>

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 border-y border-gray-200 py-3 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
            </span>
            <span className="flex items-center gap-1 text-emerald-600">
              <Eye size={14} /> {blog.views}
            </span>
            <span className="flex items-center gap-1 text-amber-600">
              <Share2 size={14} /> {blog.shares}
            </span>
          </div>

          <ShareMenu
            id={blog.id}
            type="blog"
            title={blog[`title_${lang}` as keyof BlogItem] as string || blog.title_tr}
            url={typeof window !== 'undefined' ? `${window.location.origin}/blog/${blog.id}` : ''}
            onShareComplete={refreshBlog}
          />
        </div>
      </div>

      {blog.img_url && (
        <img src={blog.img_url} alt={blog.title_tr} className="w-full h-80 object-cover rounded-2xl shadow-lg border border-gray-200" />
      )}

      {/* Paragraph Renderer with delimiter parsing */}
      <ParagraphRenderer content={blog[`description_${lang}` as keyof BlogItem] as string || blog.description_tr} className="text-base text-gray-800" />

      {/* Attachments & Sources */}
      {((blog.attachments && blog.attachments.length > 0) || (blog.links && blog.links.length > 0)) && (
        <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-4 mt-8">
          <h3 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wider">Ekler ve Bağlantılar</h3>
          
          {blog.attachments && blog.attachments.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Dokümanlar</span>
              <div className="flex flex-wrap gap-3 text-xs">
                {blog.attachments.map((att, idx) => (
                  <a
                    key={idx}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:border-black rounded-lg font-semibold text-gray-800 transition shadow-sm"
                  >
                    <Paperclip size={14} className="text-blue-500" /> {att.title || 'Ek Dosya'}
                  </a>
                ))}
              </div>
            </div>
          )}

          {blog.links && blog.links.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Dış Kaynaklar</span>
              <div className="flex flex-wrap gap-3 text-xs">
                {blog.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg font-semibold transition shadow-sm"
                  >
                    <ExternalLink size={14} className="text-purple-400" /> {link.title || 'Kaynak Bağlantısı'}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="pt-8 border-t border-gray-200 text-center pb-12">
        <Link href={`/${lang}/blogs`} className="px-6 py-3 bg-black text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition">
          {tTitles('allBlogs')} →
        </Link>
      </div>
      </main>
    </div>
  );
}
