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

export const trackVisitor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const path = req.path;
    if (path.startsWith('/uploads') || path === '/favicon.ico') {
      return next();
    }

    const rawIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress || '127.0.0.1';
    const cleanIp = rawIp.replace(/^::ffff:/, '');

    const geo = geoip.lookup(cleanIp);
    const country = geo ? geo.country : (cleanIp === '127.0.0.1' || cleanIp === '::1' ? 'Localhost' : 'Unknown');
    const city = geo ? geo.city : (cleanIp === '127.0.0.1' || cleanIp === '::1' ? 'Localhost' : 'Unknown');
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const visitorRecord = await db.select().from(visitors).where(eq(visitors.ip_address, cleanIp)).limit(1);

    let visitorId: string;

    if (visitorRecord.length === 0) {
      const newVisitor = await db.insert(visitors).values({
        ip_address: cleanIp,
        user_agent: userAgent,
        country,
        city,
        role: 'visitor',
        visit_count: 1,
      }).returning();
      visitorId = newVisitor[0]!.id;
    } else {
      visitorId = visitorRecord[0]!.id;
      await db.update(visitors).set({
        visit_count: sql`${visitors.visit_count} + 1`,
        last_visit: new Date(),
        city: city !== 'Unknown' ? city : visitorRecord[0]!.city,
        country: country !== 'Unknown' ? country : visitorRecord[0]!.country,
        user_agent: userAgent,
      }).where(eq(visitors.id, visitorId));
    }

    req.visitor = {
      id: visitorId,
      ip: cleanIp,
      city: city || 'Unknown',
      country: country || 'Unknown',
      userAgent,
    };

    if (req.method === 'GET' && !path.startsWith('/docs')) {
      await db.insert(pageViews).values({
        visitor_id: visitorId,
        path,
        ip_address: cleanIp,
        city: city || 'Unknown',
        country: country || 'Unknown',
      });
    }

    next();
  } catch (error) {
    next();
  }
};
