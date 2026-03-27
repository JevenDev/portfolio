const MONTHS = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11
};

export const PRIMARY_FILTER_TAGS = ['Design', 'Music Production'];

export function normalizeAssetPath(path) {
  if (!path || typeof path !== 'string') return '';
  return path.startsWith('/') ? path : `/${path}`;
}

function buildCardThumbPath(path) {
  if (!path || typeof path !== 'string') return '';

  const normalized = path.startsWith('/') ? path.slice(1) : path;
  if (!normalized.startsWith('assets/images/')) {
    return normalizeAssetPath(path);
  }

  const extMatch = normalized.match(/\.(jpg|jpeg|png|webp)$/i);
  if (!extMatch) {
    return normalizeAssetPath(path);
  }

  const withoutPrefix = normalized.replace(/^assets\/images\//, '');
  const withoutExt = withoutPrefix.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  return normalizeAssetPath(`assets/images/thumbs/${withoutExt}-thumb.webp`);
}

export function parseMonthYear(input) {
  if (!input || typeof input !== 'string') return new Date(0);

  const match = input.trim().match(/^(\w+)\s+(\d{4})$/);
  if (!match) {
    const fallback = new Date(input);
    return Number.isNaN(fallback.getTime()) ? new Date(0) : fallback;
  }

  const monthIndex = MONTHS[match[1].toLowerCase()];
  const year = Number(match[2]);

  if (monthIndex === undefined || Number.isNaN(year)) {
    return new Date(0);
  }

  return new Date(year, monthIndex, 1);
}

export function sortProjects(projects, sortBy) {
  const sorted = [...projects];

  if (sortBy === 'a-z') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }

  if (sortBy === 'z-a') {
    sorted.sort((a, b) => b.title.localeCompare(a.title));
    return sorted;
  }

  sorted.sort((a, b) => {
    const delta = parseMonthYear(b.year).getTime() - parseMonthYear(a.year).getTime();
    return sortBy === 'oldest' ? -delta : delta;
  });

  return sorted;
}

export function filterProjects(projects, activeTags = []) {
  if (!Array.isArray(activeTags) || activeTags.length === 0) return projects;
  return projects.filter((project) => activeTags.every((tag) => project.tags?.includes(tag)));
}

export function normalizeProject(project) {
  return {
    ...project,
    thumbCard: buildCardThumbPath(project.thumb),
    thumb: normalizeAssetPath(project.thumb),
    gallery: (project.gallery || []).map((item) => {
      if (typeof item === 'string') return normalizeAssetPath(item);
      return {
        ...item,
        url: normalizeAssetPath(item.url)
      };
    }),
    audio: project.audio
      ? {
          ...project.audio,
          src: normalizeAssetPath(project.audio.src)
        }
      : null
  };
}

export function normalizeArtist(artist) {
  return {
    ...artist,
    image: normalizeAssetPath(artist.image)
  };
}

export function getFeaturedProjects(projects, featuredIds = []) {
  if (!Array.isArray(featuredIds) || featuredIds.length === 0) {
    return projects.filter((project) => project.featured).slice(0, 3);
  }

  const selected = featuredIds
    .map((id) => projects.find((project) => project.id === id))
    .filter(Boolean);

  if (selected.length >= 3) return selected.slice(0, 3);

  const remainder = projects.filter((project) => !selected.includes(project));
  return [...selected, ...remainder].slice(0, 3);
}

export function hasMusicRole(project) {
  return project.tags?.includes('Music Production');
}
