<template>
  <main id="main-content" ref="page" tabindex="-1" class="page-shell">
    <HeroSection :email="config.email" :hero-projects="heroProjects" />
    <ModsSection :mods="mods" />
    <SelectedWorkSection :projects="selectedWorks" />
    <AboutSection
      :body="config.aboutBody"
      :headline="config.aboutHeadline"
      :location="config.location"
      :skills="config.skills"
    />
    <ArtistsSection :artists="artists" />
    <ContactSection :email="config.email" :socials="config.socials" />
  </main>
</template>

<script setup>
import { computed, ref } from 'vue';
import AboutSection from '../components/sections/AboutSection.vue';
import ArtistsSection from '../components/sections/ArtistsSection.vue';
import ContactSection from '../components/sections/ContactSection.vue';
import HeroSection from '../components/sections/HeroSection.vue';
import ModsSection from '../components/sections/ModsSection.vue';
import SelectedWorkSection from '../components/sections/SelectedWorkSection.vue';
import { usePosterMotion } from '../composables/usePosterMotion';

const page = ref(null);
usePosterMotion(page, { hero: true });

const props = defineProps({
  artists: {
    type: Array,
    default: () => []
  },
  config: {
    type: Object,
    required: true
  },
  featuredProjects: {
    type: Array,
    default: () => []
  },
  mods: {
    type: Array,
    default: () => []
  },
  projects: {
    type: Array,
    default: () => []
  }
});

function findProject(id) {
  return props.projects.find((project) => project.id === id);
}

const selectedWorks = computed(() => {
  const preferredIds = ['project-005', 'project-014', 'project-001', 'project-002', 'artwork-029', 'artwork-001'];
  const preferred = preferredIds.map(findProject).filter(Boolean);
  const fallback = props.projects.filter((project) => !preferred.includes(project));
  return [...preferred, ...fallback].slice(0, 6);
});

const heroProjects = computed(() => {
  const preferredIds = ['artwork-029', 'project-005', 'artwork-001'];
  const preferred = preferredIds.map(findProject).filter(Boolean);
  const fallback = props.featuredProjects.filter((project) => !preferred.includes(project));
  return [...preferred, ...fallback].slice(0, 3);
});
</script>
