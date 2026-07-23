'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearTokens } from '@/lib/api';
import { LayoutDashboard, UserCheck, Code2, FolderKanban, BookOpen, Image as ImageIcon, LogOut, Globe, Mail } from 'lucide-react';

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearTokens();
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'İstatistik Özeti', href: '/admin', icon: LayoutDashboard },
    { label: 'Hakkımda', href: '/admin/about', icon: UserCheck },
    { label: 'Yetenekler', href: '/admin/skills', icon: Code2 },
    { label: 'Projeler', href: '/admin/projects', icon: FolderKanban },
    { label: 'Blog Yazıları', href: '/admin/blogs', icon: BookOpen },
    { label: 'Medya / Görseller', href: '/admin/images', icon: ImageIcon },
    { label: 'İletişim Mesajları', href: '/admin/contact', icon: Mail },
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
            <span className="text-xs text-gray-400">Yönetim Paneli</span>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
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
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition"
        >
          <Globe size={14} /> Siteye Git
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:text-white hover:bg-red-950/40 rounded-lg transition font-medium text-left"
        >
          <LogOut size={14} /> Oturumu Kapat
        </button>
      </div>
    </aside>
  );
};
