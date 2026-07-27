'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { clearTokens } from '@/lib/api';
import { LayoutDashboard, UserCheck, Code2, FolderKanban, BookOpen, Image as ImageIcon, LogOut, Globe, Mail, Bot } from 'lucide-react';

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Admin.sidebar');

  const handleLogout = () => {
    clearTokens();
    router.push('/admin/login');
  };

  const switchLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    localStorage.setItem('preferred_lang', lang);
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`; // Cookie'yi de manuel sağlama alıyoruz
    router.replace(pathname, { locale: lang });
  };

  const navItems = [
    { label: t('dashboard'), href: '/admin', icon: LayoutDashboard },
    { label: t('about'), href: '/admin/about', icon: UserCheck },
    { label: t('skills'), href: '/admin/skills', icon: Code2 },
    { label: t('projects'), href: '/admin/projects', icon: FolderKanban },
    { label: t('blogs'), href: '/admin/blogs', icon: BookOpen },
    { label: t('images'), href: '/admin/images', icon: ImageIcon },
    { label: t('contact'), href: '/admin/contact', icon: Mail },
    { label: t('ai'), href: '/admin/ai-settings', icon: Bot },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 pb-6 border-b border-gray-800 mb-6">
          <div className="w-10 h-10 rounded-lg bg-white text-black font-bold flex items-center justify-center text-xl">
            DS
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-wider uppercase">DENİZ SEVİNÇ</h2>
            <span className="text-xs text-gray-400">{t('adminPanel')}</span>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            // usePathname from next-intl already strips the locale prefix
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href as any}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-gray-800 flex flex-col gap-3">
        <select
          value={locale}
          onChange={switchLanguage}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 mb-2"
        >
          <option value="tr">🇹🇷 Türkçe</option>
          <option value="en">🇬🇧 English</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="ru">🇷🇺 Русский</option>
        </select>
        
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition"
        >
          <Globe size={14} /> {t('goToSite')}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:text-white hover:bg-red-950/40 rounded-lg transition font-medium text-left"
        >
          <LogOut size={14} /> {t('logout')}
        </button>
      </div>
    </aside>
  );
};
