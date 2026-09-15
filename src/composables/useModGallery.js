import { computed, onBeforeUnmount, onMounted, ref, unref } from 'vue';

function mediaType(url = '', explicitType = '') {
  if (explicitType) return explicitType;
  if (/\.(?:mp4|webm|mov|m4v)(?:[?#]|$)/i.test(url)) return 'video';
  if (/\.gif(?:[?#]|$)/i.test(url)) return 'gif';
  return 'image';
}

function normalizeMedia(item, mod) {
  const url = item.raw_url || item.rawUrl || item.url;
  const title = item.title || mod.title;
  const description = item.description || '';

  return {
    alt: item.alt || [title, description].filter(Boolean).join(': ') || mod.featuredImageAlt,
    description,
    poster: item.poster || '',
    title,
    type: mediaType(url, item.type),
    url
  };
}

function fallbackMedia(mod) {
  const configuredMedia = Array.isArray(mod.media) ? mod.media : [];
  if (configuredMedia.length) return configuredMedia.map((item) => normalizeMedia(item, mod));

  return [{
    alt: mod.featuredImageAlt,
    description: '',
    poster: '',
    title: mod.title,
    type: mediaType(mod.featuredImage),
    url: mod.featuredImage
  }];
}

function galleryMedia(project, mod) {
  const orderedGallery = [...(project.gallery || [])]
    .filter((item) => item.raw_url || item.url)
    .sort((first, second) => Number(second.featured) - Number(first.featured) || first.ordering - second.ordering);
  const projectMedia = orderedGallery.filter((item) => !/(?:logo|icon)/i.test(item.title || ''));
  const selectedMedia = projectMedia.length ? projectMedia : orderedGallery;
  const media = selectedMedia.map((item) => normalizeMedia(item, mod));
  let firstStillIndex = media.findIndex((item) => item.type === 'image');

  if (firstStillIndex < 0 && project.raw_icon_url) {
    media.unshift(normalizeMedia({
      raw_url: project.raw_icon_url,
      title: `${mod.title} project mark`
    }, mod));
    firstStillIndex = 0;
  }

  if (firstStillIndex > 0) {
    const [firstStill] = media.splice(firstStillIndex, 1);
    media.unshift(firstStill);
  }

  return media;
}

export function useModGallery(modsSource) {
  const galleries = ref({});
  const status = ref('Loading full-resolution mod galleries.');
  const mods = computed(() => unref(modsSource) || []);
  let requestController = null;

  function mediaFor(mod) {
    return galleries.value[mod.id] || fallbackMedia(mod);
  }

  onMounted(async () => {
    const ids = mods.value.map((mod) => mod.id).filter(Boolean);
    if (!ids.length) {
      status.value = 'No mod galleries are available.';
      return;
    }

    requestController = new AbortController();

    try {
      const query = encodeURIComponent(JSON.stringify(ids));
      const response = await fetch(`https://api.modrinth.com/v2/projects?ids=${query}`, {
        signal: requestController.signal
      });
      if (!response.ok) throw new Error(`Modrinth gallery request failed with ${response.status}`);

      const projects = await response.json();
      const modById = new Map(mods.value.map((mod) => [mod.id, mod]));
      const nextGalleries = {};

      projects.forEach((project) => {
        const mod = modById.get(project.id);
        if (!mod) return;
        const media = galleryMedia(project, mod);
        if (media.length) nextGalleries[project.id] = media;
      });

      galleries.value = nextGalleries;
      status.value = 'Full-resolution mod galleries loaded from Modrinth.';
    } catch (error) {
      if (error.name === 'AbortError') return;
      status.value = 'Live galleries are unavailable. Showing selected full-resolution media.';
    }
  });

  onBeforeUnmount(() => requestController?.abort());

  return { mediaFor, status };
}
