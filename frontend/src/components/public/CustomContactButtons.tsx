'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';

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

interface Props {
  buttons: ContactSection[];
  locale: string;
}

export const CustomContactButtons: React.FC<Props> = ({ buttons, locale }) => {
  const activeButtons = buttons.filter(b => b.isActive);

  if (activeButtons.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
      {activeButtons.map((btn) => {
        // Dynamically get the Lucide icon, fallback to LinkIcon
        const IconComponent = (LucideIcons as any)[btn.icon] || LucideIcons.Link;
        const title = btn[`title_${locale}` as keyof ContactSection] as string || btn.title_tr;

        return (
          <a
            key={btn.id}
            href={btn.button_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-black hover:text-white transition duration-300 shadow-sm hover:shadow-md group"
          >
            <div className="p-2 bg-black text-white rounded-lg group-hover:bg-white group-hover:text-black transition duration-300">
              <IconComponent size={20} />
            </div>
            <span className="font-bold text-sm tracking-wide">{title}</span>
          </a>
        );
      })}
    </div>
  );
};
