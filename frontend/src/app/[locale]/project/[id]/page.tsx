'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import type { ProjectItem } from '@/types';
import { ParagraphRenderer } from '@/components/common/ParagraphRenderer';
import { ShareMenu } from '@/components/common/ShareMenu';
import { Sidebar } from '@/components/public/Sidebar';
import { ArrowLeft, Eye, Share2, Paperclip, ExternalLink, Code, Star } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [project, setProject] = useState<ProjectItem | null>(null);
  const [aboutList, setAboutList] = useState<any[]>([]);
  const lang = useLocale();
  const tTitles = useTranslations('Titles');
  const tButtons = useTranslations('Buttons');
  const tStatus = useTranslations('Status');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchProjectDetail = async () => {
      try {
        const [projectRes, aboutRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get('/about').catch(() => ({ data: { data: [] } }))
        ]);
        setProject(projectRes.data.data);
        setAboutList(aboutRes.data.data || []);
      } catch (err) {
        setError('Proje yüklenirken bir hata oluştu veya bulunamadı.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetail();
  }, [id]);

  const refreshProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data.data);
    } catch (err) {
      console.error('Error refreshing project:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-sm font-mono text-gray-500">
        {tStatus('loading')}
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <p className="text-red-500 font-semibold text-sm">{error || tStatus('noProjects')}</p>
        <Link href={`/${lang}/projects`} className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition">
          {tTitles('allProjects')}
        </Link>
      </div>
    );
  }

  const title = project[`title_${lang}` as keyof ProjectItem] as string || project.title_tr;
  const element = project[`element_${lang}` as keyof ProjectItem] as string || project.element_tr;
  const innovation = project[`innovation_${lang}` as keyof ProjectItem] as string || project.innovation_tr;

  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      {/* Sidebar */}
      <Sidebar currentLang={lang} profileImg={aboutList[0]?.pp_url} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[280px] px-6 sm:px-12 py-12 max-w-4xl mx-auto w-full space-y-8">
        <Link
          href={`/${lang}/projects`}
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
              title={title}
              url={typeof window !== 'undefined' ? `${window.location.origin}/project/${project.id}` : ''}
              onShareComplete={refreshProject}
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
                  {project.attachments.map((att, idx) => (
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

            {project.links && project.links.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Dış Kaynaklar</span>
                <div className="flex flex-wrap gap-3 text-xs">
                  {project.links.map((link, idx) => (
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
          <Link href={`/${lang}/projects`} className="px-6 py-3 bg-black text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition">
            {tTitles('allProjects')} →
          </Link>
        </div>
      </main>
    </div>
  );
}
