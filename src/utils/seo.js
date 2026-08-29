import artworksData from '../../data/artworks.json';
import configData from '../../data/config.json';
import modsData from '../../data/mods.json';
import positionsData from '../../data/positions.json';
import postsData from '../../data/posts.json';
import projectsData from '../../data/projects.json';
import { normalizeAssetPath } from './portfolio';

const allPortfolioItems = [...positionsData, ...projectsData, ...postsData, ...artworksData];
const MAX_META_DESCRIPTION_LENGTH = 160;

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

function truncateText(value, maxLength = MAX_META_DESCRIPTION_LENGTH) {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;

  const shortened = normalized.slice(0, maxLength - 1);
  const lastSpace = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, lastSpace > maxLength * 0.7 ? lastSpace : shortened.length).trim()}…`;
}

function buildPortfolioItemList(siteUrl) {
  return allPortfolioItems
    .filter((item) => item?.id && item?.title)
    .slice(0, 30)
    .map((item, index) => {
      const itemImage = normalizeAssetPath(item.thumb || '');

      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/work/${encodeURIComponent(item.id)}/`,
        item: {
          '@type': 'CreativeWork',
          name: item.title,
          description: descriptionToText(item.description) || undefined,
          image: itemImage ? toAbsoluteUrl(itemImage, siteUrl) : undefined
        }
      };
    });
}

function buildModItemList() {
  return modsData.map((mod, index) => ({
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
}

function buildSchemas({ canonicalUrl, project, siteName, siteUrl, route }) {
  const defaultDescription =
    configData.defaultDescription ||
    'Portfolio of Jeven Randhawa with design, branding, and music production projects.';
  const socialLinks = Array.isArray(configData.socials) ? configData.socials.map((social) => social.url).filter(Boolean) : [];

  const personSchema = {
    '@context': 'https://schema.org',
    '@id': `${siteUrl}/#person`,
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
    '@id': `${siteUrl}/#website`,
    '@type': 'WebSite',
    name: siteName,
    alternateName: 'JVN',
    url: siteUrl,
    description: defaultDescription,
    inLanguage: 'en-CA'
  };

  if (route.name === 'project' && !project) {
    return [websiteSchema, personSchema];
  }

  if (route.meta?.seoType === 'CollectionPage') {
    const schemas = [
      websiteSchema,
      personSchema,
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: route.meta?.seoTitle || 'Full Works Gallery',
        description: route.meta?.seoDescription || defaultDescription,
        url: canonicalUrl,
        isPartOf: {
          '@id': `${siteUrl}/#website`
        }
      }
    ];

    if (route.name === 'archive') {
      const itemList = buildPortfolioItemList(siteUrl);
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Portfolio Gallery Items',
        numberOfItems: itemList.length,
        itemListElement: itemList
      });
    }

    if (route.name === 'mods') {
      const itemList = buildModItemList();
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Minecraft mods by Jeven Randhawa',
        numberOfItems: itemList.length,
        itemListElement: itemList
      });
    }

    return schemas;
  }

  if (project) {
    return [
      websiteSchema,
      personSchema,
      {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: descriptionToText(project.description) || undefined,
        image: toAbsoluteUrl(normalizeAssetPath(project.thumb), siteUrl),
        url: canonicalUrl,
        creator: {
          '@id': `${siteUrl}/#person`
        },
        dateCreated: project.year?.match(/\b\d{4}\b/)?.[0] || undefined,
        keywords: project.tags?.join(', ') || undefined,
        isPartOf: {
          '@id': `${siteUrl}/#website`
        }
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
            name: project.title,
            item: canonicalUrl
          }
        ]
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
        '@id': `${siteUrl}/#person`
      },
      isPartOf: {
        '@id': `${siteUrl}/#website`
      }
    }
  ];
}

function buildCanonicalFromPath(path, siteUrl) {
  if (!path || path === '/') return `${siteUrl}/`;
  return `${siteUrl}${path.replace(/\/+$/, '')}/`;
}

function applySeo(route) {
  const siteName = configData.siteName || 'Portfolio';
  const siteUrl = getSiteUrl();
  const routePath = route.path || '/';
  const project = route.name === 'project' ? allPortfolioItems.find((item) => item.id === route.params?.id) : null;
  const missingProject = route.name === 'project' && !project;

  const pageTitle = missingProject
    ? `Project Not Found | ${siteName}`
    : project
    ? `${project.title} | ${siteName}`
    : route.meta?.seoTitle
      ? `${route.meta.seoTitle} | ${siteName}`
      : `${siteName} | Portfolio`;
  const pageDescription = truncateText(missingProject
    ? 'The requested portfolio project could not be found.'
    : project
    ? descriptionToText(project.description) || `${project.title}, a selected output by Jeven Randhawa.`
    : route.meta?.seoDescription || configData.defaultDescription || '');
  const canonicalPath = route.name === 'archive' ? '/archive/' : routePath;
  const canonicalUrl = buildCanonicalFromPath(canonicalPath, siteUrl);
  const collectionImage = route.name === 'mods' ? modsData[0]?.featuredImage : route.meta?.seoImage;
  const imageUrl = toAbsoluteUrl(project?.thumb || collectionImage || configData.defaultOgImage, siteUrl);
  const imageAlt = project?.title || (route.name === 'mods' ? modsData[0]?.featuredImageAlt : route.meta?.seoImageAlt) || 'Selected work from the JVN Graphics portfolio';
  const robots = missingProject || route.meta?.seoNoIndex ? 'noindex, nofollow' : 'index, follow';
  const ogType = missingProject
    ? 'website'
    : project
      ? 'article'
      : route.meta?.seoType === 'CollectionPage'
        ? 'website'
        : 'profile';

  document.title = pageTitle;

  setCanonical(canonicalUrl);
  setMetaTag({ name: 'description' }, pageDescription);
  setMetaTag({ name: 'robots' }, robots);

  setMetaTag({ property: 'og:title' }, pageTitle);
  setMetaTag({ property: 'og:description' }, pageDescription);
  setMetaTag({ property: 'og:type' }, ogType);
  setMetaTag({ property: 'og:url' }, canonicalUrl);
  setMetaTag({ property: 'og:site_name' }, siteName);
  setMetaTag({ property: 'og:locale' }, 'en_CA');
  setMetaTag({ property: 'og:image' }, imageUrl);
  setMetaTag({ property: 'og:image:secure_url' }, imageUrl);
  setMetaTag({ property: 'og:image:alt' }, imageAlt);

  setMetaTag({ name: 'twitter:card' }, 'summary_large_image');
  setMetaTag({ name: 'twitter:title' }, pageTitle);
  setMetaTag({ name: 'twitter:description' }, pageDescription);
  setMetaTag({ name: 'twitter:image' }, imageUrl);
  setMetaTag({ name: 'twitter:image:alt' }, imageAlt);

  const schemas = buildSchemas({
    canonicalUrl,
    project,
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
