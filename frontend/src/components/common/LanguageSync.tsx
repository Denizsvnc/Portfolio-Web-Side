'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';

export function LanguageSync({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedLang = localStorage.getItem('preferred_lang');
    if (savedLang && savedLang !== currentLocale) {
      // Force update cookie just in case
      document.cookie = `NEXT_LOCALE=${savedLang}; path=/; max-age=31536000`;
      // Client-side switch to preferred language to prevent flash
      router.replace({ pathname }, { locale: savedLang });
    }
  }, [currentLocale, pathname, router]);

  return null;
}
