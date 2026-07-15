import type { StrapiMedia } from './strapi';

/** Domain models — normalized shapes the UI consumes (see services/normalize.ts). */

export type ArticleStatus = 'draft' | 'in_review' | 'scheduled' | 'published';

export interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  keywords?: string;
  ogImage?: StrapiMedia | null;
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: Record<string, unknown> | null;
  noIndex?: boolean;
}

export interface Author {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  bio?: string;
  role?: string;
  email?: string;
  avatar?: StrapiMedia | null;
  twitter?: string;
  linkedin?: string;
  articleCount?: number;
}

export interface Category {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  featured?: boolean;
  parent?: Category | null;
  subcategories?: Category[];
}

export interface Tag {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
}

export interface Article {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  subtitle?: string;
  summary?: string;
  /** Rich content as HTML (rendered server-side from Strapi blocks/markdown). */
  content?: string;
  featuredImage?: StrapiMedia | null;
  imageCaption?: string;
  gallery?: StrapiMedia[];
  videoUrl?: string;
  category?: Category | null;
  subcategory?: Category | null;
  tags?: Tag[];
  author?: Author | null;
  publishedAt?: string;
  updatedAt?: string;
  scheduledAt?: string;
  readingTimeMinutes?: number;
  featured?: boolean;
  breaking?: boolean;
  editorsPick?: boolean;
  trending?: boolean;
  viewCount?: number;
  shareCount?: number;
  status?: ArticleStatus;
  seo?: SEO;
  relatedArticles?: Article[];
}

export interface MenuItem {
  id: number;
  label: string;
  url: string;
  order: number;
  target?: '_self' | '_blank';
  children?: MenuItem[];
}

export interface Advertisement {
  id: number;
  name: string;
  placement:
    | 'header'
    | 'sidebar'
    | 'in_article'
    | 'footer'
    | 'homepage_leaderboard';
  image?: StrapiMedia | null;
  targetUrl: string;
  active: boolean;
  html?: string;
}

export interface PollOption {
  id: number;
  label: string;
  votes: number;
}

export interface Poll {
  id: number;
  question: string;
  options: PollOption[];
  active: boolean;
  totalVotes: number;
}

export interface LiveBlogEntry {
  id: number;
  timestamp: string;
  title?: string;
  content: string;
  important?: boolean;
}

export interface LiveBlog {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  active: boolean;
  entries: LiveBlogEntry[];
  updatedAt?: string;
}

export interface Gallery {
  id: number;
  title: string;
  slug: string;
  description?: string;
  images: StrapiMedia[];
  category?: Category | null;
  publishedAt?: string;
}

export interface Video {
  id: number;
  title: string;
  slug: string;
  description?: string;
  youtubeId?: string;
  url?: string;
  thumbnail?: StrapiMedia | null;
  durationSeconds?: number;
  category?: Category | null;
  publishedAt?: string;
}

export interface Podcast {
  id: number;
  title: string;
  slug: string;
  description?: string;
  audioUrl: string;
  cover?: StrapiMedia | null;
  durationSeconds?: number;
  episode?: number;
  season?: number;
  publishedAt?: string;
}

export interface SiteSettings {
  siteName: string;
  tagline?: string;
  logo?: StrapiMedia | null;
  favicon?: StrapiMedia | null;
  social: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  contactEmail?: string;
  footerText?: string;
}

export interface EventItem {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  featuredImage?: StrapiMedia | null;
  startDate: string;
  endDate?: string;
  venue?: string;
  city?: string;
  registrationUrl?: string;
  isFree?: boolean;
  category?: Category | null;
  seo?: SEO;
}

export interface Comment {
  id: number;
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
  approved: boolean;
  parentId?: number | null;
  replies?: Comment[];
}
