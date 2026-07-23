export interface AboutItem {
  id: string;
  title_tr: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  text_tr: string;
  text_en: string;
  text_de: string;
  text_ru: string;
  pp_url: string;
  cv_url?: string;
}

export interface SkillItem {
  id: string;
  icon: string;
  title_tr: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  element_tr: string;
  element_en: string;
  element_de: string;
  element_ru: string;
  is_active: boolean;
}

export interface ProjectItem {
  id: string;
  icon: string;
  title_tr: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  element_tr: string;
  element_en: string;
  element_de: string;
  element_ru: string;
  innovation_tr?: string;
  innovation_en?: string;
  innovation_de?: string;
  innovation_ru?: string;
  tech_stack?: string;
  button_url: string;
  demo_url?: string;
  isSignature: boolean;
  queue: number;
  isActive: boolean;
  views: number;
  shares: number;
  attachments?: { title: string; url: string; }[];
  links?: { title: string; url: string; }[];
}

export interface BlogItem {
  id: string;
  icon?: string;
  img_url: string;
  title_tr: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  description_tr: string;
  description_en: string;
  description_de: string;
  description_ru: string;
  attachments?: { title: string; url: string; }[];
  links?: { title: string; url: string; }[];
  queue: number;
  isActive: boolean;
  views: number;
  shares: number;
  createdAt: string;
}

export interface ImageItem {
  id: string;
  image_url: string;
  alt_text: string;
  isActive: boolean;
  createdAt: string;
  blogId?: string;
  queue: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface OverviewStats {
  totalVisitors: number;
  totalVisits: number;
  totalPageViews: number;
  totalBlogReads: number;
  totalBlogShares: number;
}

export interface PageViewStat {
  path: string;
  viewsCount: number;
}

export interface CityStat {
  city: string;
  country: string;
  visitorCount: number;
  totalVisits: number;
}

export interface VisitorLog {
  id: string;
  visitor_id?: string;
  path: string;
  ip_address: string;
  city: string;
  country: string;
  created_at: string;
}
