import type { MenuItem } from '@/types';

/** Central site configuration — single source of truth for nav & metadata. */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Meridian News',
  tagline: 'Independent journalism for a connected world',
  description:
    'Breaking news, in-depth analysis, and trusted reporting on politics, business, technology, sports, and world affairs.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ogImage: '/og-default.jpg',
  locale: 'en_US',
  publisher: 'Meridian Media Group',
  founded: '2024',
  social: {
    twitter: 'https://twitter.com/meridiannews',
    facebook: 'https://facebook.com/meridiannews',
    instagram: 'https://instagram.com/meridiannews',
    youtube: 'https://youtube.com/@meridiannews',
    linkedin: 'https://linkedin.com/company/meridiannews',
  },
  twitterHandle: '@meridiannews',
} as const;

/**
 * Primary categories rendered in the mega-nav. Order matters.
 * These mirror the Strapi Category slugs and drive the homepage sections.
 */
export const primaryCategories = [
  { name: 'India', slug: 'india' },
  { name: 'World', slug: 'world' },
  { name: 'Politics', slug: 'politics' },
  { name: 'Business', slug: 'business' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Entertainment', slug: 'entertainment' },
  { name: 'Health', slug: 'health' },
  { name: 'Science', slug: 'science' },
] as const;

/** Mega-menu structure with subcategories. */
export const megaMenu: MenuItem[] = [
  {
    id: 1,
    label: 'News',
    url: '/category/india',
    order: 1,
    children: [
      { id: 11, label: 'India', url: '/category/india', order: 1 },
      { id: 12, label: 'World', url: '/category/world', order: 2 },
      { id: 13, label: 'Politics', url: '/category/politics', order: 3 },
      { id: 14, label: 'Business', url: '/category/business', order: 4 },
      { id: 15, label: 'Elections', url: '/elections', order: 5 },
    ],
  },
  {
    id: 2,
    label: 'Tech & Science',
    url: '/category/technology',
    order: 2,
    children: [
      { id: 21, label: 'Technology', url: '/category/technology', order: 1 },
      { id: 22, label: 'Science', url: '/category/science', order: 2 },
      { id: 23, label: 'Automobile', url: '/category/automobile', order: 3 },
      { id: 24, label: 'Explainers', url: '/explainers', order: 4 },
    ],
  },
  {
    id: 3,
    label: 'Life',
    url: '/category/lifestyle',
    order: 3,
    children: [
      { id: 31, label: 'Lifestyle', url: '/category/lifestyle', order: 1 },
      { id: 32, label: 'Health', url: '/category/health', order: 2 },
      { id: 33, label: 'Travel', url: '/category/travel', order: 3 },
      { id: 34, label: 'Education', url: '/category/education', order: 4 },
    ],
  },
  {
    id: 4,
    label: 'Sports',
    url: '/category/sports',
    order: 4,
  },
  {
    id: 5,
    label: 'Entertainment',
    url: '/category/entertainment',
    order: 5,
  },
  {
    id: 6,
    label: 'Opinion',
    url: '/opinion',
    order: 6,
    children: [
      { id: 61, label: 'Opinion', url: '/opinion', order: 1 },
      { id: 62, label: 'Editorial', url: '/editorial', order: 2 },
      { id: 63, label: 'Fact Check', url: '/fact-check', order: 3 },
    ],
  },
  {
    id: 7,
    label: 'Multimedia',
    url: '/videos',
    order: 7,
    children: [
      { id: 71, label: 'Videos', url: '/videos', order: 1 },
      { id: 72, label: 'Photo Gallery', url: '/gallery', order: 2 },
      { id: 73, label: 'Podcasts', url: '/podcasts', order: 3 },
      { id: 74, label: 'Live Updates', url: '/live', order: 4 },
      { id: 75, label: 'Events', url: '/events', order: 5 },
    ],
  },
];

/** Footer link columns. */
export const footerNav = [
  {
    title: 'Sections',
    links: [
      { label: 'India', href: '/category/india' },
      { label: 'World', href: '/category/world' },
      { label: 'Business', href: '/category/business' },
      { label: 'Technology', href: '/category/technology' },
      { label: 'Sports', href: '/category/sports' },
      { label: 'Opinion', href: '/opinion' },
    ],
  },
  {
    title: 'Multimedia',
    links: [
      { label: 'Videos', href: '/videos' },
      { label: 'Photo Gallery', href: '/gallery' },
      { label: 'Podcasts', href: '/podcasts' },
      { label: 'Live Updates', href: '/live' },
      { label: 'Events', href: '/events' },
      { label: 'Explainers', href: '/explainers' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Archive', href: '/archive' },
      { label: 'Fact Check', href: '/fact-check' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
] as const;
