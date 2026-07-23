'use client';

import React from 'react';
import { Download, FileText, ChevronDown } from 'lucide-react';
import { GithubIcon } from '@/components/common/Icons';
import { useTranslations } from 'next-intl';

interface HeroProps {
  firstName: string;
  lastName: string;
  cvUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({
  firstName,
  lastName,
  cvUrl = '/Deniz_Sevinc_TR_CV.pdf',
}) => {
  const t = useTranslations('Hero');
  const titles = [t('software'), t('frontend'), t('fullstack')];

  return (
    <section id="hero" className="pt-12 pb-16 md:pt-20 md:pb-24">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4 uppercase">
        <span className="text-gray-900 font-extrabold">{firstName}</span>{' '}
        <span className="text-gray-500 font-medium">{lastName}</span>
      </h1>

      <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-heading tracking-widest text-gray-600 mb-8 uppercase font-semibold">
        {titles.map((title, idx) => (
          <React.Fragment key={idx}>
            <span>{title}</span>
            {idx < titles.length - 1 && <span className="text-gray-400">·</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mt-8">
        <a
          href="https://github.com/Denizsvnc"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white font-heading font-semibold tracking-wider text-sm rounded hover:bg-gray-800 transition duration-200 shadow-md hover:-translate-y-0.5"
        >
          <GithubIcon size={18} />
          GITHUB PROJELERİM
        </a>
        <a
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black border-2 border-gray-300 font-heading font-semibold tracking-wider text-sm rounded hover:bg-black hover:text-white hover:border-black transition duration-200 shadow-sm hover:-translate-y-0.5"
        >
          <Download size={18} />
          CV İNDİR
        </a>
      </div>
    </section>
  );
};
