import type { Request, Response, NextFunction } from 'express';
import geoip from 'geoip-lite';
import { eq, sql } from 'drizzle-orm';
import { db } from '../../db';
import { visitors, pageViews } from '../../db/schema';

export interface VisitorInfo {
  id: string;
  ip: string;
  city: string;
  country: string;
  userAgent: string;
}

declare global {
  namespace Express {
    interface Request {
      visitor?: VisitorInfo;
    }
  }
}

// In-memory locks to eliminate async database race conditions from parallel API requests
const recentVisitSessionsMap = new Map<string, number>(); // cleanIp -> timestamp
const recentPageViewsMap = new Map<string, number>(); // "cleanIp:targetPagePath" -> timestamp

// 5 minutes session window for unique visit count increment
const VISIT_SESSION_WINDOW_MS = 5 * 60 * 1000;
// 5 seconds window to deduplicate page view logs for identical page
const PAGE_VIEW_DEDUPE_MS = 5 * 1000;

export const trackVisitor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const path = req.path;
    if (
      path.startsWith('/uploads') ||
      path === '/favicon.ico' ||
      path.startsWith('/api/analytics') ||
      req.method === 'OPTIONS'
    ) {
      return next();
    }

    const rawIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    const cleanIp = rawIp.replace(/^::ffff:/, '');

    const now = Date.now();
    const lastSessionTime = recentVisitSessionsMap.get(cleanIp) || 0;
    const isNewSession = now - lastSessionTime > VISIT_SESSION_WINDOW_MS;

    // SYNCHRONOUS LOCK: Lock in memory before any async DB queries to prevent race conditions
    if (isNewSession) {
      recentVisitSessionsMap.set(cleanIp, now);
    }

    const geo = geoip.lookup(cleanIp);
    const country = geo
      ? geo.country
      : cleanIp === '127.0.0.1' || cleanIp === '::1'
      ? 'Localhost'
      : 'Unknown';
    const city = geo
      ? geo.city
      : cleanIp === '127.0.0.1' || cleanIp === '::1'
      ? 'Localhost'
      : 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const visitorRecord = await db
      .select()
      .from(visitors)
      .where(eq(visitors.ip_address, cleanIp))
      .limit(1);

    let visitorId: string;
    const nowDate = new Date(now);

    if (visitorRecord.length === 0) {
      const newVisitor = await db
        .insert(visitors)
        .values({
          ip_address: cleanIp,
          user_agent: userAgent,
          country,
          city,
          role: 'visitor',
          visit_count: 1,
          last_visit: nowDate,
        })
        .returning();
      visitorId = newVisitor[0]!.id;
    } else {
      visitorId = visitorRecord[0]!.id;

      // Only increment visit_count if this request triggered a new session lock
      if (isNewSession) {
        await db
          .update(visitors)
          .set({
            visit_count: sql`${visitors.visit_count} + 1`,
            last_visit: nowDate,
            city: city !== 'Unknown' ? city : visitorRecord[0]!.city,
            country: country !== 'Unknown' ? country : visitorRecord[0]!.country,
            user_agent: userAgent,
          })
          .where(eq(visitors.id, visitorId));
      }
    }

    req.visitor = {
      id: visitorId,
      ip: cleanIp,
      city: city || 'Unknown',
      country: country || 'Unknown',
      userAgent,
    };

    // Determine target page path for pageViews table
    const pageHeader = req.headers['x-page-path'] as string;
    const targetPagePath =
      pageHeader ||
      (!req.originalUrl.startsWith('/api') && !req.originalUrl.startsWith('/docs') ? req.originalUrl : null);

    if (targetPagePath && !targetPagePath.startsWith('/admin')) {
      const dedupeKey = `${cleanIp}:${targetPagePath}`;
      const lastPageViewTime = recentPageViewsMap.get(dedupeKey) || 0;
      const shouldLogPageView = now - lastPageViewTime > PAGE_VIEW_DEDUPE_MS;

      // SYNCHRONOUS LOCK: Update memory timestamp immediately
      if (shouldLogPageView) {
        recentPageViewsMap.set(dedupeKey, now);

        await db.insert(pageViews).values({
          visitor_id: visitorId,
          path: targetPagePath,
          ip_address: cleanIp,
          city: city || 'Unknown',
          country: country || 'Unknown',
        });
      }
    }

    next();
  } catch (error) {
    next();
  }
};
