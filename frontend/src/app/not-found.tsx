import React from 'react';
import { Saira_Extra_Condensed, Open_Sans } from 'next/font/google';
import './globals.css';

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

export default function GlobalNotFound() {
  return (
    <div className={`antialiased bg-gray-950 flex flex-col items-center justify-center min-h-screen text-white p-6 relative overflow-hidden ${saira.variable} ${openSans.variable}`}>
      {/* Background decorations */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 text-center space-y-8 max-w-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-center shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
            </div>
          </div>

          <h1 className="text-8xl md:text-9xl font-black font-heading tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
            404
          </h1>
          
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold font-heading uppercase tracking-widest text-gray-200">
              Sayfa Bulunamadı
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
              Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak ulaşılamıyor olabilir. 
              Lütfen bağlantıyı kontrol edin veya ana sayfaya dönün.
            </p>
          </div>

          <div className="pt-8">
            <a 
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
            >
              Ana Sayfaya Dön
            </a>
          </div>
        </div>
    </div>
  );
}
