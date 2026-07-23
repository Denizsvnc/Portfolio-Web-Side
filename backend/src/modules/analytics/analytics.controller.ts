import type { Request, Response, NextFunction } from 'express';
import { getOverviewStats, getPageViewsStats, getCityVisitorStats, getBlogStats, getRecentVisitors, getSharesByPlatformStats, getDetailedShareLogs, getContentShareStats } from './analytics.service';

export const getOverviewReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const overview = await getOverviewStats();
    return res.status(200).json({ message: 'Genel istatistik özeti getirildi.', data: overview });
  } catch (error) {
    return next(error);
  }
};

export const getPageViewsReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pageViews = await getPageViewsStats();
    return res.status(200).json({ message: 'Sayfa görüntüleme istatistikleri getirildi.', data: pageViews });
  } catch (error) {
    return next(error);
  }
};

export const getCityReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cityStats = await getCityVisitorStats();
    return res.status(200).json({ message: 'Şehir bazlı ziyaretçi istatistikleri getirildi.', data: cityStats });
  } catch (error) {
    return next(error);
  }
};

export const getBlogReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogStats = await getBlogStats();
    return res.status(200).json({ message: 'Blog okuma ve paylaşma istatistikleri getirildi.', data: blogStats });
  } catch (error) {
    return next(error);
  }
};

export const getVisitorsLogReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const recentVisitors = await getRecentVisitors(limit);
    return res.status(200).json({ message: 'Son ziyaretçilerin verileri getirildi.', data: recentVisitors });
  } catch (error) {
    return next(error);
  }
};

export const getPlatformSharesReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const platformShares = await getSharesByPlatformStats();
    return res.status(200).json({ message: 'Platformlara göre paylaşım istatistikleri getirildi.', data: platformShares });
  } catch (error) {
    return next(error);
  }
};

export const getDetailedShareLogReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const detailedLogs = await getDetailedShareLogs(limit);
    return res.status(200).json({ message: 'Detaylı paylaşım logları getirildi.', data: detailedLogs });
  } catch (error) {
    return next(error);
  }
};

export const getContentSharesReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contentShares = await getContentShareStats();
    return res.status(200).json({ message: 'İçerik paylaşım istatistikleri getirildi.', data: contentShares });
  } catch (error) {
    return next(error);
  }
};
