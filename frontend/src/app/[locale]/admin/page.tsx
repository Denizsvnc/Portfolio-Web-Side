'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { OverviewStats, PageViewStat, CityStat, VisitorLog } from '@/types';
import { Users, Eye, BookOpen, Share2, MapPin, Layers, Clock, RefreshCw, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AdminDashboardPage() {
  const t = useTranslations('Admin.dashboard');
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [pages, setPages] = useState<PageViewStat[]>([]);
  const [cities, setCities] = useState<CityStat[]>([]);
  const [visitors, setVisitors] = useState<VisitorLog[]>([]);
  const [shares, setShares] = useState<{ platform: string; count: number }[]>([]);
  const [contentShares, setContentShares] = useState<any[]>([]);
  const [detailedShares, setDetailedShares] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [pagesPage, setPagesPage] = useState(1);
  const [logsPage, setLogsPage] = useState(1);
  const [detailedSharesPage, setDetailedSharesPage] = useState(1);
  const itemsPerPage = 10;

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [overviewRes, pagesRes, citiesRes, visitorsRes, sharesRes, detailedSharesRes, contentSharesRes] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/analytics/pages'),
        api.get('/analytics/cities'),
        api.get('/analytics/visitors?limit=200'),
        api.get('/analytics/shares'),
        api.get('/analytics/shares/detailed?limit=100'),
        api.get('/analytics/shares/content'),
      ]);

      setOverview(overviewRes.data.data);
      setPages(pagesRes.data.data || []);
      setCities(citiesRes.data.data || []);
      setVisitors(visitorsRes.data.data || []);
      setShares(sharesRes.data.data || []);
      setDetailedShares(detailedSharesRes.data.data || []);
      setContentShares(contentSharesRes.data.data || []);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Pagination calculations for Page Views
  const totalPagesPages = Math.ceil(pages.length / itemsPerPage) || 1;
  const paginatedPages = pages.slice((pagesPage - 1) * itemsPerPage, pagesPage * itemsPerPage);

  // Pagination calculations for Visitor Logs
  const totalLogsPages = Math.ceil(visitors.length / itemsPerPage) || 1;
  const paginatedLogs = visitors.slice((logsPage - 1) * itemsPerPage, logsPage * itemsPerPage);

  // Pagination calculations for Detailed Shares Logs
  const totalDetailedSharesPages = Math.ceil(detailedShares.length / itemsPerPage) || 1;
  const paginatedDetailedShares = detailedShares.slice((detailedSharesPage - 1) * itemsPerPage, detailedSharesPage * itemsPerPage);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-wider">{t('title')}</h1>
          <p className="text-xs text-gray-400 mt-1">{t('subtitle')}</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-semibold rounded-xl text-white transition self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {t('refresh')}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{t('stats.uniqueVisitors')}</span>
            <div className="text-2xl font-bold font-heading text-white mt-1">
              {loading ? '-' : overview?.totalVisitors ?? 0}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{t('stats.totalVisits')}</span>
            <div className="text-2xl font-bold font-heading text-indigo-400 mt-1">
              {loading ? '-' : overview?.totalVisits ?? 0}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Activity size={20} />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{t('stats.pageViews')}</span>
            <div className="text-2xl font-bold font-heading text-emerald-400 mt-1">
              {loading ? '-' : overview?.totalPageViews ?? 0}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Eye size={20} />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{t('stats.blogReads')}</span>
            <div className="text-2xl font-bold font-heading text-purple-400 mt-1">
              {loading ? '-' : overview?.totalBlogReads ?? 0}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <BookOpen size={20} />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{t('stats.blogShares')}</span>
            <div className="text-2xl font-bold font-heading text-amber-400 mt-1">
              {loading ? '-' : overview?.totalBlogShares ?? 0}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Share2 size={20} />
          </div>
        </div>
      </div>

      {/* City & Page Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* City Stats */}
        <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-800">
            <h3 className="font-heading text-lg font-bold tracking-wider flex items-center gap-2">
              <MapPin size={18} className="text-rose-400" /> {t('cityStats.title')}
            </h3>
            <span className="text-xs text-gray-500">{t('cityStats.label')}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="text-gray-500 uppercase bg-gray-950/50">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">{t('cityStats.city')}</th>
                  <th className="py-2.5 px-3">{t('cityStats.country')}</th>
                  <th className="py-2.5 px-3 text-right">{t('cityStats.unique')}</th>
                  <th className="py-2.5 px-3 rounded-r-lg text-right">{t('cityStats.total')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {cities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      {t('noData')}
                    </td>
                  </tr>
                ) : (
                  cities.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-800/40 transition">
                      <td className="py-3 px-3 font-semibold text-white">{item.city}</td>
                      <td className="py-3 px-3 text-gray-400">{item.country}</td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-400">{item.visitorCount}</td>
                      <td className="py-3 px-3 text-right font-mono text-gray-300">{item.totalVisits}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Page Views Stats with Pagination */}
        <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-800">
              <h3 className="font-heading text-lg font-bold tracking-wider flex items-center gap-2">
                <Layers size={18} className="text-blue-400" /> {t('pageStats.title')}
              </h3>
              <span className="text-xs text-gray-500">{t('pageStats.total', { count: pages.length })}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="text-gray-500 uppercase bg-gray-950/50">
                  <tr>
                    <th className="py-2.5 px-3 rounded-l-lg">{t('pageStats.path')}</th>
                    <th className="py-2.5 px-3 rounded-r-lg text-right">{t('pageStats.views')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {paginatedPages.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-4 text-center text-gray-500">
                        {t('noData')}
                      </td>
                    </tr>
                  ) : (
                    paginatedPages.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-800/40 transition">
                        <td className="py-3 px-3 font-mono text-white">{item.path}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-blue-400">{item.viewsCount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPagesPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-800 text-xs text-gray-400 mt-4">
              <span>
                {t('pagination.page', { current: pagesPage, total: totalPagesPages })}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={pagesPage === 1}
                  onClick={() => setPagesPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 rounded-lg text-white transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={pagesPage === totalPagesPages}
                  onClick={() => setPagesPage((p) => Math.min(totalPagesPages, p + 1))}
                  className="p-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 rounded-lg text-white transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Platform & Content Shares Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-800">
            <h3 className="font-heading text-lg font-bold tracking-wider flex items-center gap-2">
              <Share2 size={18} className="text-amber-400" /> {t('shareStats.platformTitle')}
            </h3>
            <span className="text-xs text-gray-500">{t('shareStats.platformLabel')}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="text-gray-500 uppercase bg-gray-950/50">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">{t('shareStats.platform')}</th>
                  <th className="py-2.5 px-3 rounded-r-lg text-right">{t('shareStats.count')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {shares.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-gray-500">
                      {t('noData')}
                    </td>
                  </tr>
                ) : (
                  shares.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-800/40 transition">
                      <td className="py-3 px-3 font-semibold text-white capitalize">{(item.platform || t('unknown')).replace('_', ' ')}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">{item.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-800">
            <h3 className="font-heading text-lg font-bold tracking-wider flex items-center gap-2">
              <BookOpen size={18} className="text-purple-400" /> {t('shareStats.contentTitle')}
            </h3>
            <span className="text-xs text-gray-500">{t('shareStats.contentLabel')}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="text-gray-500 uppercase bg-gray-950/50">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">{t('shareStats.title')}</th>
                  <th className="py-2.5 px-3">{t('shareStats.type')}</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">{t('shareStats.count')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {contentShares.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-500">
                      {t('noData')}
                    </td>
                  </tr>
                ) : (
                  contentShares.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-800/40 transition">
                      <td className="py-3 px-3 font-semibold text-white">{item.title}</td>
                      <td className="py-3 px-3 text-purple-400 font-mono text-[10px] uppercase">{item.type}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">{item.shares}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detailed Platform Shares Section */}
      <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-800">
          <h3 className="font-heading text-lg font-bold tracking-wider flex items-center gap-2">
            <Share2 size={18} className="text-amber-400" /> {t('shareStats.detailedTitle')}
          </h3>
          <span className="text-xs text-gray-500">{t('shareStats.detailedLabel', { count: detailedShares.length })}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="text-gray-500 uppercase bg-gray-950/50">
              <tr>
                <th className="py-3 px-4 rounded-l-lg">İçerik Başlığı</th>
                <th className="py-3 px-4">İçerik Tipi</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">IP Adresi / Şehir</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {paginatedDetailedShares.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    Henüz detaylı paylaşım logu bulunmuyor.
                  </td>
                </tr>
              ) : (
                paginatedDetailedShares.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/40 transition">
                    <td className="py-3.5 px-4 font-semibold text-white">{item.contentTitle || 'Bilinmiyor'}</td>
                    <td className="py-3.5 px-4 text-amber-400 font-mono text-[10px] uppercase">{item.contentType}</td>
                    <td className="py-3.5 px-4 text-blue-400 capitalize">{(item.platform || 'Bilinmiyor').replace('_', ' ')}</td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {item.ipAddress ? `${item.ipAddress} (${item.city || 'Bilinmiyor'})` : 'Bilinmiyor'}
                    </td>
                    <td className="py-3.5 px-4 text-right text-gray-400 font-mono">
                      {new Date(item.createdAt).toLocaleString('tr-TR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Detailed Shares Pagination Controls */}
        {totalDetailedSharesPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-800 text-xs text-gray-400 mt-4">
            <span>
              Gösterilen: {(detailedSharesPage - 1) * itemsPerPage + 1} - {Math.min(detailedSharesPage * itemsPerPage, detailedShares.length)} / Toplam {detailedShares.length} Log
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={detailedSharesPage === 1}
                onClick={() => setDetailedSharesPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 rounded-lg text-white transition font-medium flex items-center gap-1"
              >
                <ChevronLeft size={16} /> Önceki Sayfa
              </button>
              <span className="font-bold text-white px-2">
                {detailedSharesPage} / {totalDetailedSharesPages}
              </span>
              <button
                disabled={detailedSharesPage === totalDetailedSharesPages}
                onClick={() => setDetailedSharesPage((p) => Math.min(totalDetailedSharesPages, p + 1))}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 rounded-lg text-white transition font-medium flex items-center gap-1"
              >
                Sonraki Sayfa <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Visitor Page View Activity Log with Pagination */}
      <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-800">
          <h3 className="font-heading text-lg font-bold tracking-wider flex items-center gap-2">
            <Clock size={18} className="text-amber-400" /> Canlı Sayfa Ziyaret ve Log Günlüğü
          </h3>
          <span className="text-xs text-gray-500">Toplam {visitors.length} Log Kaydı</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="text-gray-500 uppercase bg-gray-950/50">
              <tr>
                <th className="py-3 px-4 rounded-l-lg">Ziyaret Edilen Sayfa</th>
                <th className="py-3 px-4">IP Adresi</th>
                <th className="py-3 px-4">Şehir / Ülke</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Ziyaret Tarihi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    Ziyaretçi log kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">{item.path}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400">{item.ip_address}</td>
                    <td className="py-3.5 px-4 text-white">
                      {item.city}, {item.country}
                    </td>
                    <td className="py-3.5 px-4 text-right text-gray-400 font-mono">
                      {new Date(item.created_at).toLocaleString('tr-TR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Visitor Logs Pagination Controls */}
        {totalLogsPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-800 text-xs text-gray-400 mt-4">
            <span>
              Gösterilen: {(logsPage - 1) * itemsPerPage + 1} - {Math.min(logsPage * itemsPerPage, visitors.length)} / Toplam {visitors.length} Log
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={logsPage === 1}
                onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 rounded-lg text-white transition font-medium flex items-center gap-1"
              >
                <ChevronLeft size={16} /> Önceki Sayfa
              </button>
              <span className="font-bold text-white px-2">
                {logsPage} / {totalLogsPages}
              </span>
              <button
                disabled={logsPage === totalLogsPages}
                onClick={() => setLogsPage((p) => Math.min(totalLogsPages, p + 1))}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 rounded-lg text-white transition font-medium flex items-center gap-1"
              >
                Sonraki Sayfa <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
