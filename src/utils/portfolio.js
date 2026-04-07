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

const TYPE_LABELS = {
  project: 'Project',
  position: 'Position',
  post: 'Post',
  artwork: 'Artwork'
};

export const PRIMARY_FILTER_TAGS = ['Projects', 'Positions', 'Design', 'Music Production', 'Motion / Editing'];

function joinWithBase(path = '') {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = String(path).replace(/^\/+/, '');
  return `${normalizedBase}${normalizedPath}`;
}

export function normalizeAssetPath(path) {
  if (!path || typeof path !== 'string') return '';
  if (/^(?:[a-z]+:)?\/\//i.test(path)) return path;
  if (/^(?:data:|mailto:|tel:|#)/i.test(path)) return path;
  return joinWithBase(path);
}

function buildThumbPath(path) {
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

  const normalizedInput = input.trim();
  const match = normalizedInput.match(/^(\w+)\s+(\d{4})(?:\b|[\s-].*)$/);
  if (!match) {
    const fallback = new Date(normalizedInput);
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

  function isOngoingProject(project) {
    if (!project?.year || typeof project.year !== 'string') return false;
    return /\b(?:present|current)\b/i.test(project.year);
  }

  function compareOngoingPriority(a, b, direction = 'newest') {
    const aIsOngoing = isOngoingProject(a);
    const bIsOngoing = isOngoingProject(b);

    if (aIsOngoing && !bIsOngoing) return direction === 'oldest' ? 1 : -1;
    if (!aIsOngoing && bIsOngoing) return direction === 'oldest' ? -1 : 1;

    if (aIsOngoing && bIsOngoing) {
      const delta = parseMonthYear(b.year).getTime() - parseMonthYear(a.year).getTime();
      if (delta !== 0) return delta;
    }

    return 0;
  }

  if (sortBy === 'a-z') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }

  if (sortBy === 'z-a') {
    sorted.sort((a, b) => b.title.localeCompare(a.title));
    return sorted;
  }

  sorted.sort((a, b) => {
    const ongoingPriority = compareOngoingPriority(a, b, sortBy === 'oldest' ? 'oldest' : 'newest');
    if (ongoingPriority !== 0) return ongoingPriority;

    const delta = parseMonthYear(b.year).getTime() - parseMonthYear(a.year).getTime();
    return sortBy === 'oldest' ? -delta : delta;
  });

  return sorted;
}

export function hasProjectType(project, targetType) {
  if (!project || !targetType) return false;

  if (Array.isArray(project.type)) {
    return project.type.includes(targetType);
  }

  return project.type === targetType;
}

export function getProjectTypeLabels(project) {
  if (!project) return [];

  const rawTypes = Array.isArray(project.type) ? project.type : [project.type];
  const labels = [];
  const seen = new Set();

  rawTypes.forEach((rawType) => {
    if (typeof rawType !== 'string') return;

    const label = TYPE_LABELS[rawType.toLowerCase()];
    if (!label || seen.has(label)) return;

    seen.add(label);
    labels.push(label);
  });

  return labels;
}

export function filterProjects(projects, activeTags = []) {
  if (!Array.isArray(activeTags) || activeTags.length === 0) return projects;

  const categoryTags = activeTags.filter((tag) => tag === 'Projects' || tag === 'Positions');
  const contentTags = activeTags.filter((tag) => !categoryTags.includes(tag));

  return projects.filter((project) => {
    const isProject = hasProjectType(project, 'project');
    const isPosition =
      hasProjectType(project, 'position') ||
      project.cardTypeLabel === 'Position' ||
      project.modalTypeLabel === 'Position';
    const matchesCategory =
      categoryTags.length === 0 ||
      categoryTags.some((tag) => {
        if (tag === 'Positions') return isPosition;
        if (tag === 'Projects') return isProject;
        return false;
      });

    const matchesTags = contentTags.every((tag) => project.tags?.includes(tag));

    return matchesCategory && matchesTags;
  });
}

export function normalizeProject(project) {
  return {
    ...project,
    thumbCard: buildThumbPath(project.thumb),
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
    imageThumb: buildThumbPath(artist.image),
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
