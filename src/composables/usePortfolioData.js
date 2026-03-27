import { computed, ref } from 'vue';
import artistsData from '../../data/artists.json';
import configData from '../../data/config.json';
import projectsData from '../../data/projects.json';
import {
  PRIMARY_FILTER_TAGS,
  filterProjects,
  getFeaturedProjects,
  hasMusicRole,
  normalizeArtist,
  normalizeProject,
  sortProjects
} from '../utils/portfolio';

export function usePortfolioData() {
  const activeTags = ref([]);
  const sortBy = ref('newest');

  const config = computed(() => configData);
  const projects = computed(() => projectsData.map(normalizeProject));
  const artists = computed(() => artistsData.map(normalizeArtist));

  const featuredProjects = computed(() => getFeaturedProjects(projects.value, config.value.homeShowcase));
  const musicProjects = computed(() => projects.value.filter(hasMusicRole).slice(0, 6));

  const filteredSortedProjects = computed(() => {
    const filtered = filterProjects(projects.value, activeTags.value);
    return sortProjects(filtered, sortBy.value);
  });

  function toggleTag(tag) {
    if (tag === 'all') {
      activeTags.value = [];
      return;
    }

    if (activeTags.value.includes(tag)) {
      activeTags.value = activeTags.value.filter((activeTag) => activeTag !== tag);
      return;
    }

    activeTags.value = [...activeTags.value, tag];
  }

  return {
    activeTags,
    artists,
    config,
    featuredProjects,
    filteredSortedProjects,
    musicProjects,
    projects,
    sortBy,
    toggleTag,
    visibleFilterTags: PRIMARY_FILTER_TAGS
  };
}