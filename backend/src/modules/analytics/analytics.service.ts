import { sql, desc, eq } from 'drizzle-orm';
import { db } from '../../db';
import { visitors, pageViews, blogAnalytics, projectAnalytics, blogs, projects } from '../../db/schema';

export const getOverviewStats = async () => {
  const totalUniqueVisitorsResult = await db.select({ count: sql<number>`count(*)` }).from(visitors);
  const totalVisitsResult = await db.select({ sum: sql<number>`coalesce(sum(${visitors.visit_count}), 0)` }).from(visitors);
  const totalPageViewsResult = await db.select({ count: sql<number>`count(*)` }).from(pageViews);
  const totalBlogReadsResult = await db.select({ count: sql<number>`count(*)` }).from(blogAnalytics).where(eq(blogAnalytics.event_type, 'read'));
  const totalBlogSharesResult = await db.select({ count: sql<number>`count(*)` }).from(blogAnalytics).where(eq(blogAnalytics.event_type, 'share'));

  return {
    totalVisitors: Number(totalUniqueVisitorsResult[0]?.count || 0),
    totalVisits: Number(totalVisitsResult[0]?.sum || 0),
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
      totalVisits: sql<number>`coalesce(sum(${visitors.visit_count}), 0)`,
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

export const getContentShareStats = async () => {
  const blogStats = await db
    .select({
      id: blogs.id,
      title: blogs.title_tr,
      type: sql<string>`'Blog'`,
      views: blogs.views,
      shares: blogs.shares,
    })
    .from(blogs)
    .orderBy(desc(blogs.shares));

  const projectStats = await db
    .select({
      id: projects.id,
      title: projects.title_tr,
      type: sql<string>`'Proje'`,
      views: projects.views,
      shares: projects.shares,
    })
    .from(projects)
    .orderBy(desc(projects.shares));

  const combined = [...blogStats, ...projectStats]
    .filter(item => item.shares > 0)
    .sort((a, b) => b.shares - a.shares);

  return combined;
};

export const getRecentVisitors = async (limit: number = 50) => {
  const result = await db
    .select({
      id: pageViews.id,
      visitor_id: pageViews.visitor_id,
      path: pageViews.path,
      ip_address: pageViews.ip_address,
      city: pageViews.city,
      country: pageViews.country,
      created_at: pageViews.created_at,
    })
    .from(pageViews)
    .orderBy(desc(pageViews.created_at))
    .limit(limit);

  return result;
};

export const getSharesByPlatformStats = async () => {
  const blogShares = await db
    .select({
      platform: blogAnalytics.platform,
      count: sql<number>`count(*)`,
    })
    .from(blogAnalytics)
    .where(eq(blogAnalytics.event_type, 'share'))
    .groupBy(blogAnalytics.platform);

  const projectShares = await db
    .select({
      platform: projectAnalytics.platform,
      count: sql<number>`count(*)`,
    })
    .from(projectAnalytics)
    .where(eq(projectAnalytics.event_type, 'share'))
    .groupBy(projectAnalytics.platform);

  // Merge the counts
  const platformCounts: Record<string, number> = {};
  
  [...blogShares, ...projectShares].forEach((item) => {
    const p = item.platform || 'Unknown';
    if (!platformCounts[p]) platformCounts[p] = 0;
    platformCounts[p] += Number(item.count);
  });

  const mergedStats = Object.entries(platformCounts)
    .map(([platform, count]) => ({ platform, count }))
    .sort((a, b) => b.count - a.count);

  return mergedStats;
};

export const getDetailedShareLogs = async (limit: number = 50) => {
  const blogSharesResult = await db
    .select({
      id: blogAnalytics.id,
      contentId: blogAnalytics.blog_id,
      contentTitle: blogs.title_tr,
      contentType: sql<string>`'Blog'`,
      platform: blogAnalytics.platform,
      ipAddress: blogAnalytics.ip_address,
      city: blogAnalytics.city,
      createdAt: blogAnalytics.created_at,
    })
    .from(blogAnalytics)
    .leftJoin(blogs, eq(blogAnalytics.blog_id, blogs.id))
    .where(eq(blogAnalytics.event_type, 'share'))
    .orderBy(desc(blogAnalytics.created_at))
    .limit(limit);

  const projectSharesResult = await db
    .select({
      id: projectAnalytics.id,
      contentId: projectAnalytics.project_id,
      contentTitle: projects.title_tr,
      contentType: sql<string>`'Proje'`,
      platform: projectAnalytics.platform,
      ipAddress: projectAnalytics.ip_address,
      city: projectAnalytics.city,
      createdAt: projectAnalytics.created_at,
    })
    .from(projectAnalytics)
    .leftJoin(projects, eq(projectAnalytics.project_id, projects.id))
    .where(eq(projectAnalytics.event_type, 'share'))
    .orderBy(desc(projectAnalytics.created_at))
    .limit(limit);

  const combined = [...blogSharesResult, ...projectSharesResult]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  return combined;
};
