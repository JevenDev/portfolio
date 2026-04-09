import artworksData from '../../data/artworks.json';
import configData from '../../data/config.json';
import positionsData from '../../data/positions.json';
import postsData from '../../data/posts.json';
import projectsData from '../../data/projects.json';
import { normalizeAssetPath } from './portfolio';

function stripTrailingSlashes(value = '') {
  return String(value).replace(/\/+$/, '');
}

function getSiteUrl() {
  if (configData.siteUrl) {
    return stripTrailingSlashes(configData.siteUrl);
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return stripTrailingSlashes(window.location.origin);
  }

  return 'https://example.com';
}

function isAbsoluteUrl(value = '') {
  return /^(?:[a-z]+:)?\/\//i.test(String(value));
}

function toAbsoluteUrl(path, siteUrl) {
  if (!path) return siteUrl;
  if (isAbsoluteUrl(path)) return path;

  const cleanedPath = String(path).trim();
  if (!cleanedPath || cleanedPath === '/') return siteUrl;

  const normalizedPath = cleanedPath.startsWith('/') ? cleanedPath : `/${cleanedPath}`;
  return `${siteUrl}${normalizedPath}`;
}

function setMetaTag(attributes, content = '') {
  if (typeof document === 'undefined') return;

  const selector = Object.entries(attributes)
    .map(([key, value]) => `[${key}="${value}"]`)
    .join('');

  let meta = document.head.querySelector(`meta${selector}`);
  if (!meta) {
    meta = document.createElement('meta');
    Object.entries(attributes).forEach(([key, value]) => meta.setAttribute(key, value));
    document.head.appendChild(meta);
  }

  meta.setAttribute('content', content);
}

function setCanonical(url) {
  if (typeof document === 'undefined') return;

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }

  canonical.setAttribute('href', url);
}

function setJsonLd(id, payload) {
  if (typeof document === 'undefined') return;

  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(payload);
}

function descriptionToText(description) {
  if (Array.isArray(description)) {
    return description.join(' ');
  }

  if (typeof description === 'string') {
    return description.trim();
  }

  return '';
}

function buildPortfolioItemList(siteUrl) {
  const allItems = [...positionsData, ...projectsData, ...postsData, ...artworksData];

  return allItems
    .filter((item) => item?.id && item?.title)
    .slice(0, 30)
    .map((item, index) => {
      const itemImage = normalizeAssetPath(item.thumb || '');

      return {
        '@type': 'CreativeWork',
        position: index + 1,
        name: item.title,
        description: descriptionToText(item.description) || undefined,
        image: itemImage ? toAbsoluteUrl(itemImage, siteUrl) : undefined,
        url: `${siteUrl}/gallery#project=${encodeURIComponent(item.id)}`
      };
    });
}

function buildSchemas({ canonicalUrl, siteName, siteUrl, route }) {
  const defaultDescription =
    configData.defaultDescription ||
    'Portfolio of Jeven Randhawa with design, branding, and music production projects.';
  const socialLinks = Array.isArray(configData.socials) ? configData.socials.map((social) => social.url).filter(Boolean) : [];

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: configData.personName || 'Jeven Randhawa',
    jobTitle: configData.jobTitle || 'Graphic Designer and Music Producer',
    url: siteUrl,
    email: configData.email ? `mailto:${configData.email}` : undefined,
    knowsAbout: ['Graphic Design', 'Brand Identity', 'Cover Art', 'Music Production', 'Web Design'],
    sameAs: socialLinks.length ? socialLinks : undefined
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: defaultDescription
  };

  if (route.path === '/gallery') {
    const itemList = buildPortfolioItemList(siteUrl);

    return [
      websiteSchema,
      personSchema,
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: route.meta?.seoTitle || 'Full Works Gallery',
        description: route.meta?.seoDescription || defaultDescription,
        url: canonicalUrl,
        isPartOf: {
          '@type': 'WebSite',
          name: siteName,
          url: siteUrl
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Portfolio Gallery Items',
        numberOfItems: itemList.length,
        itemListElement: itemList
      }
    ];
  }

  return [
    websiteSchema,
    personSchema,
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: route.meta?.seoTitle || siteName,
      description: route.meta?.seoDescription || defaultDescription,
      url: canonicalUrl,
      mainEntity: {
        '@type': 'Person',
        name: configData.personName || 'Jeven Randhawa'
      }
    }
  ];
}

function buildCanonicalFromPath(path, siteUrl) {
  if (!path || path === '/') return siteUrl;
  return `${siteUrl}${path}`;
}

function applySeo(route) {
  const siteName = configData.siteName || 'Portfolio';
  const siteUrl = getSiteUrl();
  const routePath = route.path || '/';

  const pageTitle = route.meta?.seoTitle ? `${route.meta.seoTitle} | ${siteName}` : `${siteName} | Portfolio`;
  const pageDescription = route.meta?.seoDescription || configData.defaultDescription || '';
  const pageKeywords = route.meta?.seoKeywords || configData.seoKeywords || [];
  const canonicalUrl = buildCanonicalFromPath(routePath, siteUrl);
  const imageUrl = toAbsoluteUrl(route.meta?.seoImage || configData.defaultOgImage, siteUrl);
  const robots = route.meta?.seoNoIndex ? 'noindex, nofollow' : 'index, follow';
  const ogType = route.meta?.seoType === 'CollectionPage' ? 'website' : 'profile';

  document.title = pageTitle;

  setCanonical(canonicalUrl);
  setMetaTag({ name: 'description' }, pageDescription);
  setMetaTag({ name: 'keywords' }, Array.isArray(pageKeywords) ? pageKeywords.join(', ') : String(pageKeywords));
  setMetaTag({ name: 'robots' }, robots);

  setMetaTag({ property: 'og:title' }, pageTitle);
  setMetaTag({ property: 'og:description' }, pageDescription);
  setMetaTag({ property: 'og:type' }, ogType);
  setMetaTag({ property: 'og:url' }, canonicalUrl);
  setMetaTag({ property: 'og:site_name' }, siteName);
  setMetaTag({ property: 'og:image' }, imageUrl);

  setMetaTag({ name: 'twitter:card' }, 'summary_large_image');
  setMetaTag({ name: 'twitter:title' }, pageTitle);
  setMetaTag({ name: 'twitter:description' }, pageDescription);
  setMetaTag({ name: 'twitter:image' }, imageUrl);

  const schemas = buildSchemas({
    canonicalUrl,
    route,
    siteName,
    siteUrl
  });
  setJsonLd('seo-schema', schemas);
}

export function setupSeo(router) {
  if (typeof document === 'undefined') return;

  if (router.currentRoute?.value) {
    applySeo(router.currentRoute.value);
  }

  router.afterEach((to) => {
    applySeo(to);
  });
}
