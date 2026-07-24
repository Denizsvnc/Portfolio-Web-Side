import React from 'react';
import Link from 'next/link';
import { fetchFromServer } from '@/lib/server-fetcher';
import type { ProjectItem, AboutItem } from '@/types';
import { ParagraphRenderer } from '@/components/common/ParagraphRenderer';
import { ShareMenu } from '@/components/common/ShareMenu';
import { Sidebar } from '@/components/public/Sidebar';
import { ArrowLeft, Eye, Share2, Paperclip, ExternalLink, Code, Star } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  
  const formatExternalUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      return url;
    }
    return `https://${url}`;
  };
  
  setRequestLocale(locale);

  const tTitles = await getTranslations({ locale, namespace: 'Titles' });
  const tButtons = await getTranslations({ locale, namespace: 'Buttons' });
  const tStatus = await getTranslations({ locale, namespace: 'Status' });

  // Fetch data concurrently on the server
  const [projectRes, aboutRes] = await Promise.all([
    fetchFromServer(`/projects/${slug}`),
    fetchFromServer('/about'),
  ]);

  const project: ProjectItem | null = projectRes?.data || null;
  const aboutList: AboutItem[] = aboutRes?.data || [];

  if (!project) {
    notFound(); // Triggers Next.js 404 page
  }

  const currentAbout = aboutList[0];

  const title = project[`title_${locale}` as keyof ProjectItem] as string || project.title_tr;
  const element = project[`element_${locale}` as keyof ProjectItem] as string || project.element_tr;
  const innovation = project[`innovation_${locale}` as keyof ProjectItem] as string || project.innovation_tr;

  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      {/* Sidebar */}
      <Sidebar currentLang={locale} profileImg={currentAbout?.pp_url} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[280px] px-6 sm:px-12 py-12 max-w-4xl mx-auto w-full space-y-8">
        <Link
          href={`/${locale}/projects`}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> {tTitles('allProjects')}
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold font-heading tracking-tight text-gray-900">{title}</h1>
          
          {project.tech_stack && (
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.split(',').map((tech, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-[10px] font-mono font-bold uppercase rounded-md border border-gray-200">
                  {tech.trim()}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 border-y border-gray-200 py-3 font-mono mt-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-emerald-600">
                <Eye size={14} /> {project.views || 0}
              </span>
              <span className="flex items-center gap-1 text-amber-600">
                <Share2 size={14} /> {project.shares || 0}
              </span>
            </div>

            <ShareMenu
              id={project.id}
              type="project"
              title={project[`title_${locale}` as keyof ProjectItem] as string || project.title_tr}
              url={`/${locale}/project/${project.slug || project.id}`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {(project.button_url || project.demo_url) && (
          <div className="flex flex-wrap gap-3">
            {project.button_url && (
              <a
                href={project.button_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold text-xs transition"
              >
                <Code size={16} /> {tButtons('githubRepo')}
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-black hover:bg-gray-50 rounded-lg font-semibold text-xs transition shadow-sm"
              >
                <ExternalLink size={16} /> {tButtons('liveDemo')}
              </a>
            )}
          </div>
        )}

        {/* Description */}
        <div className="prose prose-sm max-w-none">
          <ParagraphRenderer content={element} className="text-base text-gray-800" />
        </div>

        {/* Innovation/Impact Section */}
        {innovation && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h2 className="text-xl font-bold font-heading mb-4 text-gray-900 flex items-center gap-2">
              <Star size={20} className="text-amber-500" /> {tTitles('innovation')}
            </h2>
            <ParagraphRenderer content={innovation} className="text-sm text-gray-700 italic border-l-4 border-amber-400 pl-4 bg-amber-50/50 py-3 pr-3 rounded-r-lg" />
          </div>
        )}

        {/* Attachments & Sources */}
        {((project.attachments && project.attachments.length > 0) || (project.links && project.links.length > 0)) && (
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-4 mt-8">
            <h3 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wider">Ekler ve Bağlantılar</h3>
            
            {project.attachments && project.attachments.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Dokümanlar</span>
                <div className="flex flex-wrap gap-3 text-xs">
                  {project.attachments.map((att: any, idx: number) => (
                    <a
                      key={idx}
                      href={formatExternalUrl(att.url)}
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

            {project.links && project.links.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Dış Kaynaklar</span>
                <div className="flex flex-wrap gap-3 text-xs">
                  {project.links.map((link: any, idx: number) => (
                    <a
                      key={idx}
                      href={formatExternalUrl(link.url)}
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
          <Link href={`/${locale}/projects`} className="px-6 py-3 bg-black text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition">
            {tTitles('allProjects')} →
          </Link>
        </div>
      </main>
    </div>
  );
}
