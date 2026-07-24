import React from 'react';
import Link from 'next/link';
import { fetchFromServer } from '@/lib/server-fetcher';
import type { BlogItem, AboutItem } from '@/types';
import { Sidebar } from '@/components/public/Sidebar';
import { ShareMenu } from '@/components/common/ShareMenu';
import { ArrowLeft, BookOpen, Eye, Share2 } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AllBlogsPage({ params }: Props) {
  const { locale } = await params;
  
  setRequestLocale(locale);

  const tTitles = await getTranslations({ locale, namespace: 'Titles' });
  const tButtons = await getTranslations({ locale, namespace: 'Buttons' });
  const tStatus = await getTranslations({ locale, namespace: 'Status' });

  // Fetch data concurrently on the server
  const [blogsRes, aboutRes] = await Promise.all([
    fetchFromServer('/blogs'),
    fetchFromServer('/about'),
  ]);

  const blogsList: BlogItem[] = blogsRes.data || [];
  const aboutList: AboutItem[] = aboutRes.data || [];
  const currentAbout = aboutList[0];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      {/* Sidebar */}
      <Sidebar currentLang={locale} profileImg={currentAbout?.pp_url} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[280px] px-6 sm:px-12 py-12 max-w-5xl mx-auto space-y-10">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> {tButtons('backToPortfolio') || "Portfolio'ya Dön"}
        </Link>

        <div className="space-y-2 border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-extrabold font-heading tracking-wider">{tTitles('allBlogs') || "TÜM BLOG YAZILARI"}</h1>
          <p className="text-sm text-gray-500 font-sans">{tTitles('blogSubtitle') || "Yazılım, Mimari ve Deneyim Makaleleri"}</p>
        </div>

        {blogsList.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-sans">{tStatus('noBlogs')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogsList.map((blog) => (
              <div key={blog.id} className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
                {blog.img_url && (
                  <img src={blog.img_url} alt={blog.title_tr} className="w-full h-48 object-cover rounded-t-2xl" />
                )}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-xl mb-2">{blog[`title_${locale}` as keyof BlogItem] as string || blog.title_tr}</h3>
                    <p className="text-xs text-gray-600 line-clamp-3">{blog[`description_${locale}` as keyof BlogItem] as string || blog.description_tr}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-xs">
                    <div className="flex items-center gap-3 text-gray-500 font-mono">
                      <span className="flex items-center gap-1"><Eye size={14} /> {blog.views}</span>
                      <span className="flex items-center gap-1"><Share2 size={14} /> {blog.shares}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <ShareMenu
                        id={blog.id}
                        type="blog"
                        title={blog[`title_${locale}` as keyof typeof blog] as string || blog.title_tr}
                        url={`/${locale}/blog/${blog.slug || blog.id}`}
                      />
                      <Link
                        href={`/${locale}/blog/${blog.slug || blog.id}`}
                        className="px-3 py-1 bg-black text-white hover:bg-gray-800 rounded text-xs font-semibold transition inline-flex items-center gap-1"
                      >
                        {tButtons('read')} <BookOpen size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
