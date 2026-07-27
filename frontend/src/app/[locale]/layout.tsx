import type { Metadata } from 'next';
import { Saira_Extra_Condensed, Open_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SEO' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    authors: [{ name: 'Deniz Sevinç' }],
    creator: 'Deniz Sevinç',
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://denizsevinc.com.tr',
      siteName: 'Deniz Sevinç Portfolio',
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: 'https://denizsevinc.com.tr',
      languages: {
        'tr-TR': 'https://denizsevinc.com.tr/tr',
        'en-US': 'https://denizsevinc.com.tr/en',
        'de-DE': 'https://denizsevinc.com.tr/de',
        'ru-RU': 'https://denizsevinc.com.tr/ru',
      },
    },
  };
}

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
