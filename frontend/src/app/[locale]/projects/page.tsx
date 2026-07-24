import React from 'react';
import Link from 'next/link';
import { fetchFromServer } from '@/lib/server-fetcher';
import type { ProjectItem, AboutItem } from '@/types';
import { Sidebar } from '@/components/public/Sidebar';
import { ShareMenu } from '@/components/common/ShareMenu';
import { ArrowLeft, ExternalLink, Star, Lightbulb } from 'lucide-react';
import { GithubIcon } from '@/components/common/Icons';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AllProjectsPage({ params }: Props) {
  const { locale } = await params;
  
  setRequestLocale(locale);

  const tTitles = await getTranslations({ locale, namespace: 'Titles' });
  const tButtons = await getTranslations({ locale, namespace: 'Buttons' });
  const tStatus = await getTranslations({ locale, namespace: 'Status' });

  // Fetch data concurrently on the server
  const [projectsRes, aboutRes] = await Promise.all([
    fetchFromServer('/projects'),
    fetchFromServer('/about'),
  ]);

  const projectsList: ProjectItem[] = projectsRes.data || [];
  const aboutList: AboutItem[] = aboutRes.data || [];
  const currentAbout = aboutList[0];

  const sortedProjects = [...projectsList].sort((a, b) => b.queue - a.queue);
  const signatureProjects = sortedProjects.filter((p) => p.isSignature);
  const otherProjects = sortedProjects.filter((p) => !p.isSignature);

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
          <h1 className="text-4xl font-extrabold font-heading tracking-wider">{tTitles('allProjects') || "TÜM PROJELERİM"}</h1>
          <p className="text-sm text-gray-500 font-sans">{tTitles('projectsSubtitle') || "Geliştirdiğim SaaS, Mini ERP ve Açık Kaynaklı Projeler"}</p>
        </div>

        {projectsList.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-sans">{tStatus('noProjects')}</div>
        ) : (
          <div className="space-y-12">
            {/* Signature Banners */}
            {signatureProjects.map((sigProj) => (
              <div key={sigProj.id} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-8 sm:p-10 shadow-2xl space-y-6 signature-glow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Star className="text-amber-400 fill-amber-400" size={24} />
                    <h2 className="text-3xl font-bold font-heading">
                      {sigProj[`title_${locale}` as keyof ProjectItem] as string || sigProj.title_tr}
                    </h2>
                    <ShareMenu
                      id={sigProj.id}
                      type="project"
                      title={sigProj[`title_${locale}` as keyof ProjectItem] as string || sigProj.title_tr}
                      url={`/${locale}/project/${sigProj.slug || sigProj.id}`}
                      variant="icon"
                    />
                  </div>
                  {sigProj.tech_stack && (
                    <div className="flex flex-wrap gap-2">
                      {sigProj.tech_stack.split(',').map((t, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white/20 rounded-md text-xs font-bold font-mono">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-gray-300 text-base leading-relaxed">
                  {sigProj[`element_${locale}` as keyof ProjectItem] as string || sigProj.element_tr}
                </p>

                {(sigProj[`innovation_${locale as 'tr'|'en'|'de'|'ru'}`] || sigProj.innovation_tr) && (
                  <div className="bg-amber-500/10 border-l-4 border-amber-400 p-4 rounded-r-xl space-y-1">
                    <h4 className="text-amber-400 font-bold text-sm flex items-center gap-2">
                      <Lightbulb size={16} /> {tTitles('innovation') || "İnovasyon Odaklı Güvenlik"}
                    </h4>
                    <p className="text-xs text-gray-300">
                      {sigProj[`innovation_${locale as 'tr'|'en'|'de'|'ru'}`] || sigProj.innovation_tr}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href={`/${locale}/project/${sigProj.slug || sigProj.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg font-bold text-xs transition shadow-lg"
                  >
                    {tButtons('viewDetails') || "Detayları Gör"} →
                  </Link>
                  {sigProj.button_url && (
                    <a
                      href={sigProj.button_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold text-xs transition"
                    >
                      <GithubIcon size={16} /> {tButtons('githubRepo') || "GitHub Reposu"}
                    </a>
                  )}
                  {sigProj.demo_url && (
                    <a
                      href={sigProj.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold text-xs transition"
                    >
                      <ExternalLink size={16} /> {tButtons('liveDemo') || "Canlı Demo"}
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* All Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherProjects.map((project) => (
                <div key={project.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition">
                  <div className="space-y-3">
                    <Link href={`/${locale}/project/${project.slug || project.id}`} className="hover:text-emerald-600 transition">
                      <h3 className="font-heading font-bold text-xl">{project[`title_${locale}` as keyof ProjectItem] as string || project.title_tr}</h3>
                    </Link>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{project[`element_${locale}` as keyof ProjectItem] as string || project.element_tr}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-200 flex items-center justify-between">
                    <Link
                      href={`/${locale}/project/${project.slug || project.id}`}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition flex items-center gap-1"
                    >
                      {tButtons('viewDetails') || "Detayları Gör"} →
                    </Link>
                    {project.button_url && (
                      <a
                        href={project.button_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-black hover:underline"
                      >
                        GitHub <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
