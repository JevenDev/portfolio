import { computed } from 'vue';
import artistsData from '../../data/artists.json';
import artworksData from '../../data/artworks.json';
import configData from '../../data/config.json';
import modsData from '../../data/mods.json';
import postsData from '../../data/posts.json';
import positionsData from '../../data/positions.json';
import projectsData from '../../data/projects.json';
import {
  getFeaturedProjects,
  normalizeArtist,
  normalizeProject
} from '../utils/portfolio';

export function usePortfolioData() {
  const allPortfolioItems = [...postsData, ...projectsData, ...positionsData, ...artworksData];

  const config = computed(() => configData);
  const mods = computed(() => modsData);
  const projects = computed(() => allPortfolioItems.map(normalizeProject));
  const artists = computed(() => artistsData.map(normalizeArtist));

  const featuredProjects = computed(() => getFeaturedProjects(projects.value, config.value.homeShowcase));
  return {
    artists,
    config,
    featuredProjects,
    mods,
    projects
  };
}
