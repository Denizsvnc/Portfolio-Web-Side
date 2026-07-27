'use client';

import React, { useState } from 'react';
import { usePathname, useRouter, Link } from '@/i18n/routing';
import { Phone, Mail, Menu, X, Globe } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '@/components/common/Icons';
import { useTranslations } from 'next-intl';

interface SidebarProps {
  currentLang: string;
  profileImg?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentLang, profileImg }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Sidebar');
  const isHomePage = pathname === '/';

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-black text-white rounded-lg shadow-lg hover:bg-gray-800 transition"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[280px] bg-black text-white flex flex-col justify-between p-8 z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col items-center text-center mt-6">
          {/* Profile Picture */}
          <div className="relative group mb-6 w-40 h-40 flex items-center justify-center">
            {profileImg ? (
              <Link href="/">
                <img
                  src={profileImg}
                  alt="Profil Fotoğrafı"
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition duration-300 cursor-pointer"
                />
              </Link>
            ) : (
              <div className="w-40 h-40 rounded-full border-4 border-white/10 bg-white/5 animate-pulse shadow-xl" />
            )}
          </div>

          {/* Social Icons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <a
              href="https://github.com/Denizsvnc"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition duration-200"
              title="GitHub"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/deniz-sevinç-819529261"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition duration-200"
              title="LinkedIn"
            >
              <LinkedinIcon size={18} />
            </a>
            <a
              href="tel:+905478985659"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition duration-200"
              title="Telefon"
            >
              <Phone size={18} />
            </a>
            <a
              href="mailto:info@denizsevinc.com.tr"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition duration-200"
              title="E-posta"
            >
              <Mail size={18} />
            </a>
            <a
              href="https://www.instagram.com/denizsevinc0_/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition duration-200"
              title="Instagram"
            >
              <InstagramIcon size={18} />
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-4 font-heading text-lg tracking-wider text-gray-300">
            <button
              onClick={() => scrollToSection('hero')}
              className={`hover:text-white transition text-left ${pathname === '/' ? 'text-white font-bold' : ''}`}
            >
              ANASAYFA
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-white transition text-left uppercase"
            >
              {t('about') || "HAKKIMDA"}
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="hover:text-white transition text-left uppercase"
            >
              {t('skills') || "YETENEKLER"}
            </button>
            <Link
              href="/projects"
              onClick={() => setIsOpen(false)}
              className={`hover:text-white transition uppercase ${pathname === '/projects' ? 'text-white font-bold' : ''}`}
            >
              {t('projects')}
            </Link>
            <Link
              href="/blogs"
              onClick={() => setIsOpen(false)}
              className={`hover:text-white transition uppercase ${pathname === '/blogs' ? 'text-white font-bold' : ''}`}
            >
              {t('blog')}
            </Link>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-white transition text-left uppercase"
            >
              {t('contact')}
            </button>
          </nav>
        </div>

        {/* Bottom Bar: Language Selector */}
        <div className="flex flex-col gap-4 items-center pt-6 border-t border-white/10">
          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs font-semibold">
            <Globe size={14} className="text-gray-400" />
            {(['tr', 'en', 'de', 'ru'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  localStorage.setItem('preferred_lang', lang);
                  document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`; // Cookie'yi de manuel sağlama alıyoruz
                  router.replace({ pathname }, { locale: lang });
                }}
                className={`uppercase px-2 py-0.5 rounded ${
                  currentLang === lang ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};
