import type { Metadata } from 'next';
import { Saira_Extra_Condensed, Open_Sans } from 'next/font/google';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${saira.variable} ${openSans.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased bg-white text-gray-900 selection:bg-black selection:text-white">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
