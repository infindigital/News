import type {
  Article,
  Author,
  Category,
  Gallery,
  LiveBlog,
  Podcast,
  Poll,
  SiteSettings,
  StrapiMedia,
  Tag,
  Video,
} from '@/types';

/** Build a StrapiMedia stub from an Unsplash id (whitelisted in next.config). */
const img = (id: string, alt: string, w = 1600, h = 900): StrapiMedia => ({
  id: Math.abs(hashCode(id)),
  url: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`,
  alternativeText: alt,
  width: w,
  height: h,
});

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h;
}

// ── Categories ────────────────────────────────────────────────────────────
export const mockCategories: Category[] = [
  { id: 1, name: 'India', slug: 'india', color: '#1d4ed8', featured: true },
  { id: 2, name: 'World', slug: 'world', color: '#0e7490', featured: true },
  { id: 3, name: 'Politics', slug: 'politics', color: '#b91c1c', featured: true },
  { id: 4, name: 'Business', slug: 'business', color: '#047857', featured: true },
  { id: 5, name: 'Technology', slug: 'technology', color: '#6d28d9', featured: true },
  { id: 6, name: 'Sports', slug: 'sports', color: '#c2410c', featured: true },
  { id: 7, name: 'Entertainment', slug: 'entertainment', color: '#be185d' },
  { id: 8, name: 'Health', slug: 'health', color: '#0891b2' },
  { id: 9, name: 'Science', slug: 'science', color: '#4338ca' },
  { id: 10, name: 'Lifestyle', slug: 'lifestyle', color: '#7c3aed' },
];

const cat = (slug: string) => mockCategories.find((c) => c.slug === slug)!;

// ── Authors ───────────────────────────────────────────────────────────────
export const mockAuthors: Author[] = [
  {
    id: 1,
    name: 'Ananya Sharma',
    slug: 'ananya-sharma',
    role: 'Senior Political Correspondent',
    bio: 'Ananya covers national politics and policy with over a decade reporting from the capital.',
    avatar: img('1494790108377-be9c29b29330', 'Ananya Sharma', 400, 400),
    twitter: 'https://twitter.com/ananya',
    articleCount: 214,
  },
  {
    id: 2,
    name: 'Marcus Bennett',
    slug: 'marcus-bennett',
    role: 'World Affairs Editor',
    bio: 'Marcus reports on geopolitics, conflict and diplomacy across four continents.',
    avatar: img('1500648767791-00dcc994a43e', 'Marcus Bennett', 400, 400),
    articleCount: 178,
  },
  {
    id: 3,
    name: 'Priya Nair',
    slug: 'priya-nair',
    role: 'Technology Correspondent',
    bio: 'Priya writes on AI, startups and the business of technology.',
    avatar: img('1438761681033-6461ffad8d80', 'Priya Nair', 400, 400),
    articleCount: 143,
  },
  {
    id: 4,
    name: 'David Okonkwo',
    slug: 'david-okonkwo',
    role: 'Business Editor',
    bio: 'David tracks markets, macro policy and corporate strategy.',
    avatar: img('1507003211169-0a1dd7228f2d', 'David Okonkwo', 400, 400),
    articleCount: 96,
  },
];

const author = (slug: string) => mockAuthors.find((a) => a.slug === slug)!;

// ── Tags ──────────────────────────────────────────────────────────────────
export const mockTags: Tag[] = [
  { id: 1, name: 'Elections 2026', slug: 'elections-2026' },
  { id: 2, name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
  { id: 3, name: 'Climate', slug: 'climate' },
  { id: 4, name: 'Economy', slug: 'economy' },
  { id: 5, name: 'Cricket', slug: 'cricket' },
  { id: 6, name: 'Elections', slug: 'elections' },
];

const richBody = `
<p class="lead">In a development that reshapes the outlook for the year ahead, officials confirmed the announcement late on Tuesday, drawing swift reaction from analysts and markets alike.</p>
<h2 id="what-happened">What happened</h2>
<p>The decision followed weeks of closed-door negotiations. Sources familiar with the matter described the talks as "constructive but tense," with several sticking points resolved only in the final hours.</p>
<figure><img src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=70" alt="Newsroom" /><figcaption>Analysts pored over the details through the night. Credit: Meridian</figcaption></figure>
<blockquote class="pullquote">"This is the most consequential shift we have seen in a generation," said one senior official.</blockquote>
<h2 id="why-it-matters">Why it matters</h2>
<p>The ramifications extend well beyond the immediate parties. Economists point to knock-on effects for supply chains, employment and consumer prices over the coming quarters.</p>
<ul><li>Immediate market reaction was cautiously positive.</li><li>Regional partners signalled tentative support.</li><li>Opposition figures demanded further scrutiny.</li></ul>
<h2 id="what-comes-next">What comes next</h2>
<p>A formal framework is expected within weeks. For now, all sides have agreed to a cooling-off period while technical committees hammer out the finer points.</p>
`;

// ── Articles ──────────────────────────────────────────────────────────────
function makeArticle(
  id: number,
  partial: Partial<Article> & Pick<Article, 'title' | 'slug'>,
): Article {
  return {
    id,
    subtitle:
      partial.subtitle ??
      'A closer look at the story shaping today’s headlines and what it means next.',
    summary:
      partial.summary ??
      'Officials confirmed the news late on Tuesday, drawing swift reaction from analysts and markets across the region.',
    content: partial.content ?? richBody,
    readingTimeMinutes: 4,
    publishedAt: partial.publishedAt ?? '2026-07-14T08:30:00.000Z',
    updatedAt: partial.updatedAt ?? '2026-07-14T10:15:00.000Z',
    viewCount: partial.viewCount ?? 4200,
    shareCount: partial.shareCount ?? 320,
    status: 'published',
    ...partial,
  };
}

export const mockArticles: Article[] = [
  makeArticle(1, {
    title: 'Landmark climate accord reached after marathon overnight talks',
    slug: 'landmark-climate-accord-reached',
    subtitle:
      'Nearly 190 nations agree to accelerate the phase-down of fossil fuels in a deal hailed as historic.',
    featuredImage: img('1611273426858-450d8e3c9fce', 'Climate summit'),
    imageCaption: 'Delegates applaud as the final text is gavelled through.',
    category: cat('world'),
    author: author('marcus-bennett'),
    tags: [mockTags[2]!],
    breaking: true,
    featured: true,
    trending: true,
    editorsPick: true,
    viewCount: 128400,
  }),
  makeArticle(2, {
    title: 'Central bank holds rates as inflation cools to two-year low',
    slug: 'central-bank-holds-rates-inflation-cools',
    featuredImage: img('1554224155-6726b3ff858f', 'Central bank building'),
    category: cat('business'),
    author: author('david-okonkwo'),
    tags: [mockTags[3]!],
    featured: true,
    trending: true,
    viewCount: 54000,
  }),
  makeArticle(3, {
    title: 'AI regulation bill clears committee in landmark vote',
    slug: 'ai-regulation-bill-clears-committee',
    featuredImage: img('1620712943543-bcc4688e7485', 'AI circuit board'),
    category: cat('technology'),
    author: author('priya-nair'),
    tags: [mockTags[1]!],
    editorsPick: true,
    trending: true,
    viewCount: 41200,
  }),
  makeArticle(4, {
    title: 'Ruling party unveils manifesto ahead of general election',
    slug: 'ruling-party-unveils-manifesto',
    featuredImage: img('1529107386315-e1a2ed48a620', 'Parliament'),
    category: cat('politics'),
    author: author('ananya-sharma'),
    tags: [mockTags[0]!, mockTags[5]!],
    breaking: true,
    featured: true,
    viewCount: 98700,
  }),
  makeArticle(5, {
    title: 'National side clinch series in a last-over thriller',
    slug: 'national-side-clinch-series-thriller',
    featuredImage: img('1540747913346-19e32dc3e97e', 'Cricket stadium'),
    category: cat('sports'),
    author: author('marcus-bennett'),
    tags: [mockTags[4]!],
    trending: true,
    viewCount: 76300,
  }),
  makeArticle(6, {
    title: 'Monsoon forecast points to above-average rainfall this season',
    slug: 'monsoon-forecast-above-average-rainfall',
    featuredImage: img('1428592953211-077101b2021b', 'Monsoon clouds'),
    category: cat('india'),
    author: author('ananya-sharma'),
    editorsPick: true,
    viewCount: 33900,
  }),
  makeArticle(7, {
    title: 'Startups raise record funding despite cautious market',
    slug: 'startups-raise-record-funding',
    featuredImage: img('1559136555-9303baea8ebd', 'Startup office'),
    category: cat('business'),
    author: author('david-okonkwo'),
    viewCount: 21400,
  }),
  makeArticle(8, {
    title: 'New telescope captures sharpest image yet of distant galaxy',
    slug: 'telescope-captures-sharpest-image',
    featuredImage: img('1451187580459-43490279c0fa', 'Galaxy'),
    category: cat('science'),
    author: author('priya-nair'),
    trending: true,
    viewCount: 62000,
  }),
  makeArticle(9, {
    title: 'Health officials launch nationwide vaccination drive',
    slug: 'health-officials-launch-vaccination-drive',
    featuredImage: img('1576091160399-112ba8d25d1d', 'Vaccination'),
    category: cat('health'),
    author: author('ananya-sharma'),
    viewCount: 18700,
  }),
  makeArticle(10, {
    title: 'Blockbuster premiere breaks weekend box office records',
    slug: 'blockbuster-premiere-breaks-records',
    featuredImage: img('1489599849927-2ee91cede3ba', 'Cinema'),
    category: cat('entertainment'),
    author: author('marcus-bennett'),
    trending: true,
    viewCount: 47800,
  }),
  makeArticle(11, {
    title: 'Trade talks resume as tariffs loom over key sectors',
    slug: 'trade-talks-resume-tariffs-loom',
    featuredImage: img('1526304640581-d334cdbbf45e', 'Shipping port'),
    category: cat('world'),
    author: author('david-okonkwo'),
    tags: [mockTags[3]!],
    viewCount: 29500,
  }),
  makeArticle(12, {
    title: 'City rolls out ambitious green transport plan',
    slug: 'city-rolls-out-green-transport-plan',
    featuredImage: img('1556742049-0cfed4f6a45d', 'Electric bus'),
    category: cat('india'),
    author: author('ananya-sharma'),
    tags: [mockTags[2]!],
    viewCount: 15200,
  }),
];

// ── Multimedia ────────────────────────────────────────────────────────────
export const mockVideos: Video[] = [
  {
    id: 1,
    title: 'Explained: What the new climate accord actually changes',
    slug: 'explained-climate-accord',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: img('1611273426858-450d8e3c9fce', 'Climate explainer', 800, 450),
    durationSeconds: 380,
    category: cat('world'),
    publishedAt: '2026-07-13T12:00:00.000Z',
  },
  {
    id: 2,
    title: 'Inside the chip factory powering the AI boom',
    slug: 'inside-the-chip-factory',
    youtubeId: 'aqz-KE-bpKQ',
    thumbnail: img('1620712943543-bcc4688e7485', 'Chip factory', 800, 450),
    durationSeconds: 540,
    category: cat('technology'),
    publishedAt: '2026-07-12T09:00:00.000Z',
  },
];

export const mockPodcasts: Podcast[] = [
  {
    id: 1,
    title: 'The Daily Briefing — Tuesday',
    slug: 'daily-briefing-tuesday',
    description: 'Your ten-minute guide to the stories shaping the day.',
    audioUrl: 'https://cdn.example.com/audio/daily-briefing.mp3',
    cover: img('1478737270239-2f02b77fc618', 'Podcast cover', 600, 600),
    durationSeconds: 620,
    episode: 412,
    publishedAt: '2026-07-14T06:00:00.000Z',
  },
];

export const mockGalleries: Gallery[] = [
  {
    id: 1,
    title: 'In pictures: The week that was',
    slug: 'the-week-that-was',
    description: 'A visual journey through the past seven days.',
    images: [
      img('1506905925346-21bda4d32df4', 'Landscape', 1200, 800),
      img('1470071459604-3b5ec3a7fe05', 'Mountains', 1200, 800),
      img('1441974231531-c6227db76b6e', 'Forest', 1200, 800),
    ],
    category: cat('world'),
    publishedAt: '2026-07-13T18:00:00.000Z',
  },
];

export const mockLiveBlog: LiveBlog = {
  id: 1,
  title: 'Live: General election results as they happen',
  slug: 'live-general-election-results',
  summary: 'Follow live updates, reaction and analysis through the night.',
  active: true,
  updatedAt: '2026-07-14T11:00:00.000Z',
  entries: [
    {
      id: 1,
      timestamp: '2026-07-14T11:00:00.000Z',
      title: 'Early leads emerge',
      content:
        '<p>The first constituencies begin to report, with a tight race in key battlegrounds.</p>',
      important: true,
    },
    {
      id: 2,
      timestamp: '2026-07-14T10:30:00.000Z',
      content: '<p>Counting is underway across the country.</p>',
    },
  ],
};

export const mockPoll: Poll = {
  id: 1,
  question: 'What issue matters most to you this election?',
  active: true,
  totalVotes: 1240,
  options: [
    { id: 1, label: 'Economy', votes: 520 },
    { id: 2, label: 'Healthcare', votes: 310 },
    { id: 3, label: 'Climate', votes: 260 },
    { id: 4, label: 'Education', votes: 150 },
  ],
};

export const mockSiteSettings: SiteSettings = {
  siteName: 'Meridian News',
  tagline: 'Independent journalism for a connected world',
  social: {
    twitter: 'https://twitter.com/meridiannews',
    facebook: 'https://facebook.com/meridiannews',
    instagram: 'https://instagram.com/meridiannews',
    youtube: 'https://youtube.com/@meridiannews',
  },
  contactEmail: 'newsroom@meridian.news',
  footerText: '© 2026 Meridian Media Group. All rights reserved.',
};

// ── Events (example custom post type) ───────────────────────────────────────
export const mockEvents: import('@/types').EventItem[] = [
  {
    id: 1,
    title: 'Global Climate Summit 2026',
    slug: 'global-climate-summit-2026',
    summary:
      'World leaders, scientists and activists gather to chart the next decade of climate action.',
    description:
      '<p>A three-day summit featuring keynote addresses, panel discussions and policy workshops on the path to net zero.</p>',
    featuredImage: img('1511578314322-379afb476865', 'Conference hall'),
    startDate: '2026-09-12T09:00:00.000Z',
    endDate: '2026-09-14T17:00:00.000Z',
    venue: 'Convention Centre',
    city: 'New Delhi',
    registrationUrl: 'https://example.com/register',
    isFree: false,
    category: cat('world'),
  },
  {
    id: 2,
    title: 'Tech Founders Meetup',
    slug: 'tech-founders-meetup',
    summary: 'An evening of talks and networking for startup founders and builders.',
    description:
      '<p>Hear from founders who scaled from garage to IPO, followed by open networking.</p>',
    featuredImage: img('1540575467063-178a50c2df87', 'Meetup crowd'),
    startDate: '2026-08-05T18:00:00.000Z',
    endDate: '2026-08-05T21:00:00.000Z',
    venue: 'Innovation Hub',
    city: 'Bengaluru',
    isFree: true,
    category: cat('technology'),
  },
  {
    id: 3,
    title: 'City Marathon 2026',
    slug: 'city-marathon-2026',
    summary: 'Thousands take to the streets for the annual charity marathon.',
    description: '<p>Full, half and 10K categories. Proceeds support local health charities.</p>',
    featuredImage: img('1552674605-db6ffd4facb5', 'Marathon runners'),
    startDate: '2026-10-02T06:00:00.000Z',
    venue: 'City Center',
    city: 'Mumbai',
    isFree: false,
    category: cat('sports'),
  },
];

// Wire related articles (avoid self-reference).
mockArticles.forEach((a) => {
  a.relatedArticles = mockArticles
    .filter((o) => o.id !== a.id && o.category?.slug === a.category?.slug)
    .slice(0, 4);
  if ((a.relatedArticles?.length ?? 0) < 3) {
    a.relatedArticles = mockArticles.filter((o) => o.id !== a.id).slice(0, 4);
  }
});
