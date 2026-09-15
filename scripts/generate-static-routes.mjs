import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const root = process.cwd();
const distRoot = join(root, 'dist');

async function readJson(path) {
  return JSON.parse(await readFile(join(root, path), 'utf8'));
}

const [
  template,
  config,
  positions,
  projects,
  posts,
  artworks,
  mods
] = await Promise.all([
  readFile(join(distRoot, 'index.html'), 'utf8'),
  readJson('data/config.json'),
  readJson('data/positions.json'),
  readJson('data/projects.json'),
  readJson('data/posts.json'),
  readJson('data/artworks.json'),
  readJson('data/mods.json')
]);

const imageVariants = await readJson('data/image-variants.json');
const portfolioItems = [...posts, ...projects, ...positions, ...artworks];
const siteName = config.siteName || 'JVN Graphics';
const siteUrl = String(config.siteUrl || 'https://jvn.graphics').replace(/\/+$/, '');
const defaultDescription = config.defaultDescription || 'Portfolio of Jeven Randhawa with design, branding, and music production projects.';
const defaultImage = toAbsoluteUrl(config.defaultOgImage);
const defaultImageAlt = 'Selected work from the JVN Graphics portfolio';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeXml(value = '') {
  return escapeHtml(value);
}

function toPlainText(value = '') {
  const text = Array.isArray(value) ? value.join(' ') : value;
  return String(text || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncateText(value, maxLength = 160) {
  const normalized = toPlainText(value);
  if (normalized.length <= maxLength) return normalized;

  const shortened = normalized.slice(0, maxLength - 1);
  const lastSpace = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, lastSpace > maxLength * 0.7 ? lastSpace : shortened.length).trim()}…`;
}

function toAbsoluteUrl(path = '') {
  if (!path) return siteUrl;
  if (/^(?:[a-z]+:)?\/\//i.test(path)) return path;
  return `${siteUrl}/${String(path).replace(/^\/+/, '')}`;
}

function toThumbnailPath(path = '') {
  const normalized = String(path).replace(/^\/+/, '');
  const match = normalized.match(/^assets\/images\/(.*)\.(?:jpg|jpeg|png|webp)$/i);
  return match ? `/assets/images/thumbs/${match[1]}-thumb.webp` : `/${normalized}`;
}

function routeUrl(path = '/') {
  return path === '/' ? `${siteUrl}/` : `${siteUrl}${path.replace(/\/+$/, '')}/`;
}

function upsertMeta(html, attribute, key, content) {
  const tag = `<meta ${attribute}="${escapeHtml(key)}" content="${escapeHtml(content)}" />`;
  const pattern = new RegExp(`<meta\\s+[^>]*${attribute}=["']${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'i');
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

function setCanonical(html, canonical) {
  const tag = `<link rel="canonical" href="${escapeHtml(canonical)}" />`;
  const pattern = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

function buildBaseSchemas() {
  const socialLinks = Array.isArray(config.socials) ? config.socials.map((social) => social.url).filter(Boolean) : [];
  return [
    {
      '@context': 'https://schema.org',
      '@id': `${siteUrl}/#website`,
      '@type': 'WebSite',
      name: siteName,
      alternateName: 'JVN',
      url: siteUrl,
      description: defaultDescription,
      inLanguage: 'en-CA'
    },
    {
      '@context': 'https://schema.org',
      '@id': `${siteUrl}/#person`,
      '@type': 'Person',
      name: config.personName || 'Jeven Randhawa',
      jobTitle: config.jobTitle || 'Graphic Designer and Music Producer',
      url: siteUrl,
      email: config.email ? `mailto:${config.email}` : undefined,
      knowsAbout: ['Graphic Design', 'Brand Identity', 'Cover Art', 'Music Production', 'Web Design'],
      sameAs: socialLinks.length ? socialLinks : undefined
    }
  ];
}

function buildHomeSchemas() {
  return [
    ...buildBaseSchemas(),
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: 'Graphic Design and Music Production Portfolio',
      description: defaultDescription,
      url: `${siteUrl}/`,
      mainEntity: { '@id': `${siteUrl}/#person` },
      isPartOf: { '@id': `${siteUrl}/#website` }
    }
  ];
}

function buildArchiveSchemas(canonical) {
  const itemList = portfolioItems.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${siteUrl}/work/${encodeURIComponent(item.id)}/`,
    item: {
      '@type': 'CreativeWork',
      name: item.title,
      description: toPlainText(item.description) || undefined,
      image: item.thumb ? toAbsoluteUrl(item.thumb) : undefined
    }
  }));

  return [
    ...buildBaseSchemas(),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Output Archive',
      description: 'Search the complete JVN Graphics archive across visual identity, artwork, digital design, games, and audio.',
      url: canonical,
      isPartOf: { '@id': `${siteUrl}/#website` }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'JVN Graphics portfolio projects',
      numberOfItems: itemList.length,
      itemListElement: itemList
    }
  ];
}

function buildModSchemas(canonical) {
  const itemList = mods.map((mod, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `https://modrinth.com/mod/${mod.slug}`,
    item: {
      '@type': 'SoftwareApplication',
      name: mod.title,
      description: mod.overview || mod.description,
      applicationCategory: 'GameApplication',
      operatingSystem: 'Minecraft Java Edition'
    }
  }));

  return [
    ...buildBaseSchemas(),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Minecraft Mods',
      description: 'Minecraft mods by Jeven Randhawa spanning combat, atmosphere, survival systems, utilities, and village mechanics.',
      url: canonical,
      isPartOf: { '@id': `${siteUrl}/#website` }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Minecraft mods by Jeven Randhawa',
      numberOfItems: itemList.length,
      itemListElement: itemList
    }
  ];
}

function buildProjectSchemas(item, canonical) {
  return [
    ...buildBaseSchemas(),
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: item.title,
      description: toPlainText(item.description) || undefined,
      image: item.thumb ? toAbsoluteUrl(item.thumb) : undefined,
      url: canonical,
      creator: { '@id': `${siteUrl}/#person` },
      dateCreated: item.year?.match(/\b\d{4}\b/)?.[0] || undefined,
      keywords: item.tags?.join(', ') || undefined,
      isPartOf: { '@id': `${siteUrl}/#website` }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Archive',
          item: `${siteUrl}/archive/`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: item.title,
          item: canonical
        }
      ]
    }
  ];
}

function renderNavigation() {
  return `<nav aria-label="Primary navigation"><a href="/">Home</a><a href="/archive/">Archive</a><a href="/mods/">Mods</a><a href="mailto:${escapeHtml(config.email || '')}">Contact</a></nav>`;
}

function renderShell(mainContent) {
  return `<div class="static-shell"><header><a href="/" class="static-shell__brand">Jeven Randhawa</a>${renderNavigation()}</header>${mainContent}<footer><p>${escapeHtml(defaultDescription)}</p><a href="mailto:${escapeHtml(config.email || '')}">${escapeHtml(config.email || '')}</a></footer></div>`;
}

function renderHomeContent() {
  const selected = portfolioItems.filter((item) => item.featured).slice(0, 6);
  return renderShell(`<main><h1>Jeven Randhawa</h1><p>${escapeHtml(defaultDescription)}</p><section><h2>Selected work</h2><ul>${selected.map((item) => `<li><a href="/work/${encodeURIComponent(item.id)}/">${escapeHtml(item.title)}</a><span>${escapeHtml(item.role || '')} / ${escapeHtml(item.year || '')}</span></li>`).join('')}</ul></section></main>`);
}

function renderArchiveContent() {
  return renderShell(`<main><h1>Project archive</h1><p>Visual identity, artwork, digital design, games, motion, and audio work by Jeven Randhawa.</p><ul>${portfolioItems.map((item) => `<li><a href="/work/${encodeURIComponent(item.id)}/">${escapeHtml(item.title)}</a><span>${escapeHtml(item.role || '')} / ${escapeHtml(item.year || '')}</span></li>`).join('')}</ul></main>`);
}

function renderModsContent() {
  return renderShell(`<main><h1>Minecraft mods by Jeven Randhawa</h1><p>Minecraft systems for combat, atmosphere, survival, navigation, villagers, and shared multi-loader infrastructure.</p><ul>${mods.map((mod) => `<li><h2>${escapeHtml(mod.title)}</h2><p>${escapeHtml(mod.overview || mod.description)}</p><a href="https://modrinth.com/mod/${encodeURIComponent(mod.slug)}">View on Modrinth</a><a href="https://www.curseforge.com/minecraft/mc-mods/${encodeURIComponent(mod.curseforge.slug)}">View on CurseForge</a></li>`).join('')}</ul></main>`);
}

function renderProjectContent(item) {
  const descriptions = Array.isArray(item.description) ? item.description : [item.description];
  return renderShell(`<main><p><a href="/archive/">Project archive</a></p><h1>${escapeHtml(item.title)}</h1><p>${escapeHtml(item.role || '')} / ${escapeHtml(item.year || '')}</p>${descriptions.filter(Boolean).map((line) => `<p>${escapeHtml(line)}</p>`).join('')}<h2>Services</h2><ul>${(item.tags || []).map((tag) => `<li>${escapeHtml(tag)}</li>`).join('')}</ul></main>`);
}

function renderNotFoundContent() {
  return renderShell('<main><h1>Page not found</h1><p>The requested page could not be found.</p><p><a href="/archive/">Browse the project archive</a></p></main>');
}

const staticStyle = `<style id="static-shell-styles">.static-shell{max-width:90rem;margin:0 auto;padding:2rem clamp(1.25rem,4vw,4rem);font-family:'Archivo',sans-serif}.static-shell header,.static-shell nav{display:flex;flex-wrap:wrap;align-items:center;gap:1rem}.static-shell header{justify-content:space-between;border-bottom:1px solid;padding-bottom:1rem}.static-shell__brand{font-weight:700}.static-shell main{padding:clamp(3rem,8vw,8rem) 0}.static-shell h1{max-width:14ch;margin:0 0 1.5rem;font-size:clamp(3rem,10vw,8rem);line-height:.9}.static-shell h2{margin-top:3rem}.static-shell ul{display:grid;gap:1rem;padding:0;list-style:none}.static-shell li{display:grid;gap:.25rem;border-top:1px solid;padding-top:.75rem}.static-shell li span{color:#66645f}.static-shell footer{border-top:1px solid;padding-top:1rem}</style>`;

function renderHtml(page) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  html = html.replace(/<meta\s+[^>]*name=["']keywords["'][^>]*>\s*/i, '');
  html = setCanonical(html, page.canonical);
  html = upsertMeta(html, 'name', 'description', page.description);
  html = upsertMeta(html, 'name', 'robots', page.robots || 'index, follow');
  html = upsertMeta(html, 'property', 'og:type', page.ogType || 'website');
  html = upsertMeta(html, 'property', 'og:locale', 'en_CA');
  html = upsertMeta(html, 'property', 'og:site_name', siteName);
  html = upsertMeta(html, 'property', 'og:title', page.title);
  html = upsertMeta(html, 'property', 'og:description', page.description);
  html = upsertMeta(html, 'property', 'og:url', page.canonical);
  html = upsertMeta(html, 'property', 'og:image', page.image);
  html = upsertMeta(html, 'property', 'og:image:secure_url', page.image);
  html = upsertMeta(html, 'property', 'og:image:alt', page.imageAlt);
  html = upsertMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = upsertMeta(html, 'name', 'twitter:title', page.title);
  html = upsertMeta(html, 'name', 'twitter:description', page.description);
  html = upsertMeta(html, 'name', 'twitter:image', page.image);
  html = upsertMeta(html, 'name', 'twitter:image:alt', page.imageAlt);
  html = html.replace(/<script[^>]+id=["']seo-schema["'][^>]*>[\s\S]*?<\/script>\s*/i, '');
  html = html.replace(/\s*<link[^>]+data-page-preload[^>]*>/gi, '');
  if (page.preloadImage) {
    const media = page.preloadMedia ? ` media="${escapeHtml(page.preloadMedia)}"` : '';
    html = html.replace('</head>', `    <link rel="preload" as="image" href="${escapeHtml(page.preloadImage)}" fetchpriority="high"${media} data-page-preload />\n  </head>`);
  }
  const schema = JSON.stringify(page.schemas).replaceAll('<', '\\u003c');
  html = html.replace('</head>', `    <script type="application/ld+json" id="seo-schema">${schema}</script>\n    ${staticStyle}\n  </head>`);
  return html.replace('<div id="app"></div>', `<div id="app">${page.content}</div>`);
}

const homePage = {
  path: '/',
  canonical: routeUrl('/'),
  title: `Graphic Design & Music Production Portfolio | ${siteName}`,
  description: truncateText('Portfolio of Jeven Randhawa featuring brand identity, cover art, web projects, game interfaces, and music production collaborations.'),
  image: defaultImage,
  imageAlt: defaultImageAlt,
  preloadImage: (() => {
    const feature = portfolioItems.find((item) => item.id === 'artwork-001');
    return feature?.thumbDisplay ? `/${feature.thumbDisplay.replace(/^\/+/, '')}` : toThumbnailPath(feature?.thumb || '');
  })(),
  preloadMedia: '(min-width: 761px)',
  ogType: 'profile',
  schemas: buildHomeSchemas(),
  content: renderHomeContent()
};

const archiveCanonical = routeUrl('/archive');
const archivePage = {
  path: '/archive',
  canonical: archiveCanonical,
  title: `Output Archive | ${siteName}`,
  description: 'Search the complete JVN Graphics archive across visual identity, artwork, digital design, games, and audio.',
  image: defaultImage,
  imageAlt: defaultImageAlt,
  schemas: buildArchiveSchemas(archiveCanonical),
  content: renderArchiveContent()
};

const modsCanonical = routeUrl('/mods');
const modsPage = {
  path: '/mods',
  canonical: modsCanonical,
  title: `Minecraft Mods | ${siteName}`,
  description: 'Minecraft mods by Jeven Randhawa spanning combat, atmosphere, survival systems, utilities, and village mechanics.',
  image: mods[0]?.featuredImage || defaultImage,
  imageAlt: mods[0]?.featuredImageAlt || defaultImageAlt,
  schemas: buildModSchemas(modsCanonical),
  content: renderModsContent()
};

const projectPages = portfolioItems.map((item) => {
  const path = `/work/${encodeURIComponent(item.id)}`;
  const canonical = routeUrl(path);
  return {
    path,
    canonical,
    title: `${item.title} | ${siteName}`,
    description: truncateText(toPlainText(item.description) || `${item.title}, a selected output by Jeven Randhawa.`),
    image: item.thumb ? toAbsoluteUrl(item.thumb) : defaultImage,
    imageAlt: item.title,
    preloadImage: item.thumb ? toAbsoluteUrl(item.thumbDisplay || imageVariants[item.thumb] || item.thumb) : '',
    preloadMedia: '(min-width: 761px)',
    ogType: 'article',
    schemas: buildProjectSchemas(item, canonical),
    content: renderProjectContent(item)
  };
});

const galleryPage = {
  ...archivePage,
  path: '/gallery'
};

const notFoundPage = {
  path: '/404',
  canonical: routeUrl('/404'),
  title: `Page Not Found | ${siteName}`,
  description: 'The requested page could not be found.',
  image: defaultImage,
  imageAlt: defaultImageAlt,
  robots: 'noindex, nofollow',
  schemas: buildBaseSchemas(),
  content: renderNotFoundContent()
};

const pages = [homePage, archivePage, galleryPage, modsPage, ...projectPages];

for (const page of pages) {
  const outputPath = page.path === '/'
    ? join(distRoot, 'index.html')
    : join(distRoot, page.path.replace(/^\//, ''), 'index.html');
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderHtml(page), 'utf8');
}

await writeFile(join(distRoot, '404.html'), renderHtml(notFoundPage), 'utf8');

const sitemapUrls = [homePage, archivePage, modsPage, ...projectPages].map((page) => page.canonical);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(join(distRoot, 'sitemap.xml'), sitemap, 'utf8');

console.log(`Generated ${pages.length} route shells, a noindex 404 page, and ${sitemapUrls.length} sitemap URLs.`);
