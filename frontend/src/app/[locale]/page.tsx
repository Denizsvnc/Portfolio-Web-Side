import React from 'react';
import Link from 'next/link';
import { fetchFromServer } from '@/lib/server-fetcher';
import type { AboutItem, SkillItem, ProjectItem, BlogItem } from '@/types';
import { Sidebar } from '@/components/public/Sidebar';
import { Hero } from '@/components/public/Hero';
import { ContactForm } from '@/components/public/ContactForm';
import { CustomContactButtons } from '@/components/public/CustomContactButtons';
import { GithubIcon } from '@/components/common/Icons';
import { ShareMenu } from '@/components/common/ShareMenu';
import { Code2, ExternalLink, BookOpen, Share2, Eye, Lightbulb, Star, ArrowRight } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PublicHomePage({ params }: Props) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  const tTitles = await getTranslations({ locale, namespace: 'Titles' });
  const tStatus = await getTranslations({ locale, namespace: 'Status' });
  const tButtons = await getTranslations({ locale, namespace: 'Buttons' });

  const [aboutRes, skillsRes, projectsRes, blogsRes, settingsRes, contactSectionsRes] = await Promise.all([
    fetchFromServer('/about'),
    fetchFromServer('/skills'),
    fetchFromServer('/projects'),
    fetchFromServer('/blogs'),
    fetchFromServer('/settings'),
    fetchFromServer('/contact-sections'),
  ]);

  const aboutList: AboutItem[] = aboutRes.data || [];
  const skillsList: SkillItem[] = skillsRes.data || [];
  const projectsList: ProjectItem[] = projectsRes.data || [];
  const blogsList: BlogItem[] = blogsRes.data || [];

  const currentAbout = aboutList[0];

  const signatureProject = projectsList.find((p) => p.isSignature) || projectsList[0];
  const featuredProjects = projectsList.filter((p) => p.id !== signatureProject?.id);

  // Show maximum 3 items on home page
  const visibleProjects = featuredProjects.slice(0, 3);
  const hasMoreProjects = featuredProjects.length > 3;

  const visibleBlogs = blogsList.slice(0, 3);
  const hasMoreBlogs = blogsList.length > 3;

  const siteSettings = settingsRes?.data || {};

  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      {/* Sidebar */}
      <Sidebar 
        currentLang={locale} 
        profileImg={currentAbout?.pp_url} 
        siteSettings={siteSettings} 
        contactSections={contactSectionsRes?.data || []}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[280px] px-6 sm:px-12 py-12 max-w-4xl mx-auto">
        {/* Hero */}
        <Hero
          firstName="DENİZ"
          lastName="SEVİNÇ"
          cvUrl={currentAbout?.cv_url || '/Deniz_Sevinc_TR_CV.pdf'}
        />

        {/* About Section */}
        <section id="about" className="py-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold font-heading mb-6 tracking-wider">
            {tTitles('about')}
          </h2>

          {currentAbout ? (
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>{currentAbout[`text_${locale}` as keyof AboutItem] as string || currentAbout.text_tr}</p>
            </div>
          ) : (
            <p className="text-gray-600 text-base">
              Bafra Mesleki ve Teknik Anadolu Lisesi Bilgi Teknolojileri – Yazılım Geliştirme bölümünün ardından,
              Ondokuz Mayıs Üniversitesi Bilgisayar Programcılığı bölümünden mezun oldum. Akademik eğitimim sırasında makine öğrenmesi odaklı projemizle TÜBİTAK Ulusal Proje Yarışması&apos;nda Türkiye 4.&apos;sü olma başarısı gösterdik.
            </p>
          )}
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold font-heading mb-6 tracking-wider">
            {tTitles('skills')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {skillsList.map((skill) => (
              <div
                key={skill.id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                  <Code2 size={24} />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">
                  {skill[`title_${locale}` as keyof SkillItem] as string || skill.title_tr}
                </h3>
                <p className="text-sm text-gray-500 font-sans leading-relaxed">
                  {skill[`element_${locale}` as keyof SkillItem] as string || skill.element_tr}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Signature Project & Featured Projects */}
        <section id="projects" className="py-12 border-t border-gray-200 space-y-10">
          <div className="flex items-center gap-2">
            <Star className="text-amber-500 fill-amber-500" size={24} />
            <h2 className="text-3xl font-bold font-heading tracking-wider">
              {tTitles('signatureProject')}
            </h2>
          </div>

          {/* Dynamic Signature Banner Card */}
          {signatureProject ? (
            <div className="relative rounded-2xl bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-8 sm:p-10 shadow-2xl space-y-6 signature-glow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-3xl font-bold font-heading">
                  {signatureProject[`title_${locale}` as keyof ProjectItem] as string || signatureProject.title_tr}
                </h3>
                {signatureProject.tech_stack && (
                  <div className="flex flex-wrap gap-2">
                    {signatureProject.tech_stack.split(',').map((t, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/20 rounded-md text-xs font-bold font-mono">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-gray-300 text-base leading-relaxed">
                {signatureProject[`element_${locale}` as keyof ProjectItem] as string || signatureProject.element_tr}
              </p>

              {(signatureProject[`innovation_${locale as 'tr'|'en'|'de'|'ru'}`] || signatureProject.innovation_tr) && (
                <div className="bg-amber-500/10 border-l-4 border-amber-400 p-4 rounded-r-xl space-y-1">
                  <h4 className="text-amber-400 font-bold text-sm flex items-center gap-2">
                    <Lightbulb size={16} /> {tTitles('innovation')}
                  </h4>
                  <p className="text-xs text-gray-300">
                    {signatureProject[`innovation_${locale as 'tr'|'en'|'de'|'ru'}`] || signatureProject.innovation_tr}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-4 pt-2">
                {signatureProject.button_url && (
                  <a
                    href={signatureProject.button_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold text-xs transition"
                  >
                    <GithubIcon size={16} /> {tButtons('githubRepo')} →
                  </a>
                )}
                {signatureProject.demo_url && (
                  <a
                    href={signatureProject.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold text-xs transition"
                  >
                    <ExternalLink size={16} /> {tButtons('liveDemo')}
                  </a>
                )}
                <ShareMenu
                  id={signatureProject.id}
                  type="project"
                  title={signatureProject[`title_${locale}` as keyof typeof signatureProject] as string || signatureProject.title_tr}
                  url={`/${locale}/project/${signatureProject.slug || signatureProject.id}`}
                />
              </div>
            </div>
          ) : (
            <div className="p-8 bg-gray-50 border border-gray-200 rounded-2xl text-center text-gray-500 text-sm">
              {tStatus('noSignatureProject')}
            </div>
          )}

          <h2 className="text-3xl font-bold font-heading tracking-wider pt-6">
            {tTitles('featuredProjects')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleProjects.map((project) => (
              <div key={project.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition">
                <div className="space-y-3">
                  <h3 className="font-heading font-bold text-xl">{project[`title_${locale}` as keyof ProjectItem] as string || project.title_tr}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{project[`element_${locale}` as keyof ProjectItem] as string || project.element_tr}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-200 flex items-center justify-between">
                  {project.button_url && (
                    <a
                      href={project.button_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-black hover:underline"
                    >
                      GitHub / İncele <ExternalLink size={14} />
                    </a>
                  )}
                  <ShareMenu
                    id={project.id}
                    type="project"
                    title={project[`title_${locale}` as keyof typeof project] as string || project.title_tr}
                    url={`/${locale}/project/${project.slug || project.id}`}
                    variant="icon"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* "Daha Fazla Proje İncele" Button */}
          {hasMoreProjects && (
            <div className="text-center pt-4">
              <Link
                href={`/${locale}/projects`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800 rounded-xl font-heading font-semibold text-sm tracking-wider transition shadow-md hover:-translate-y-0.5"
              >
                {tButtons('moreProjects')} <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>

        {/* Blogs Section */}
        <section id="blogs" className="py-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold font-heading mb-6 tracking-wider">
            {tTitles('blogPosts')}
          </h2>

          {blogsList.length === 0 ? (
            <div className="text-sm text-gray-500">{tStatus('noBlogs')}</div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleBlogs.map((blog) => (
                  <div key={blog.id} className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    {blog.img_url && (
                      <img src={blog.img_url} alt={blog.title_tr} className="w-full h-48 object-cover rounded-t-xl" />
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

              {/* "Daha Fazla Blog Yazısı İncele" Button */}
              {hasMoreBlogs && (
                <div className="text-center pt-4">
                  <Link
                    href={`/${locale}/blogs`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800 rounded-xl font-heading font-semibold text-sm tracking-wider transition shadow-md hover:-translate-y-0.5"
                  >
                    {tButtons('moreBlogs')} <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 border-t border-gray-200">
          <CustomContactButtons buttons={contactSectionsRes?.data || []} locale={locale} />
          <ContactForm />
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-gray-200 text-center text-sm text-gray-500 font-mono">
          &copy; {new Date().getFullYear()} Deniz SEVİNÇ. Tüm hakları saklıdır.
        </footer>
      </main>
    </div>
  );
}
