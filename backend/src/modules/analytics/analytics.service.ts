import { sql, desc, eq } from 'drizzle-orm';
import { db } from '../../db';
import { visitors, pageViews, blogAnalytics, blogs } from '../../db/schema';

export const getOverviewStats = async () => {
  const totalVisitorsResult = await db.select({ count: sql<number>`count(*)` }).from(visitors);
  const totalPageViewsResult = await db.select({ count: sql<number>`count(*)` }).from(pageViews);
  const totalBlogReadsResult = await db.select({ count: sql<number>`count(*)` }).from(blogAnalytics).where(eq(blogAnalytics.event_type, 'read'));
  const totalBlogSharesResult = await db.select({ count: sql<number>`count(*)` }).from(blogAnalytics).where(eq(blogAnalytics.event_type, 'share'));

  return {
    totalVisitors: Number(totalVisitorsResult[0]?.count || 0),
    totalPageViews: Number(totalPageViewsResult[0]?.count || 0),
    totalBlogReads: Number(totalBlogReadsResult[0]?.count || 0),
    totalBlogShares: Number(totalBlogSharesResult[0]?.count || 0),
  };
};

export const getPageViewsStats = async () => {
  const stats = await db
    .select({
      path: pageViews.path,
      viewsCount: sql<number>`count(*)`,
    })
    .from(pageViews)
    .groupBy(pageViews.path)
    .orderBy(desc(sql`count(*)`));
  return stats;
};

export const getCityVisitorStats = async () => {
  const stats = await db
    .select({
      city: visitors.city,
      country: visitors.country,
      visitorCount: sql<number>`count(*)`,
      totalVisits: sql<number>`sum(${visitors.visit_count})`,
    })
    .from(visitors)
    .groupBy(visitors.city, visitors.country)
    .orderBy(desc(sql`count(*)`));
  return stats;
};

export const getBlogStats = async () => {
  const stats = await db
    .select({
      blogId: blogs.id,
      title_tr: blogs.title_tr,
      title_en: blogs.title_en,
      views: blogs.views,
      shares: blogs.shares,
      createdAt: blogs.createdAt,
    })
    .from(blogs)
    .orderBy(desc(blogs.views));
  return stats;
};

export const getRecentVisitors = async (limit: number = 50) => {
  const result = await db.select().from(visitors).orderBy(desc(visitors.last_visit)).limit(limit);
  return result;
};
