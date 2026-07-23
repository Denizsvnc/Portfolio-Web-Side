import type { Metadata } from 'next';
import { Saira_Extra_Condensed, Open_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '@/app/globals.css';
import { Toaster } from 'react-hot-toast';

const saira = Saira_Extra_Condensed({
  weight: ['500', '700'],
  subsets: ['latin'],
  variable: '--font-saira',
});

const openSans = Open_Sans({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-open-sans',
});

export const metadata: Metadata = {
  title: 'Deniz Sevinç - Software Developer',
  description: 'Deniz Sevinç - Bilgi Teknolojileri ve Yazılım Geliştirme alanında uzman. React, Next.js, TypeScript ve Node.js full-stack portfolio.',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${saira.variable} ${openSans.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased bg-white text-gray-900 selection:bg-black selection:text-white">
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster position="bottom-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
