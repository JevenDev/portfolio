<template>
  <main id="main-content" tabindex="-1" class="pt-14 md:pt-[5.5rem] focus-visible:outline-none">
    <HeroSection
      :name="'Jeven Randhawa'"
      :tagline="config.tagline"
      :location="config.location"
      :hero-project="heroProject"
      @navigate="emit('navigate', $event)"
      @open-project="emit('open-project', $event)"
    />

    <AboutSection
      :headline="config.aboutHeadline"
      :body="config.aboutBody"
      :location="config.location"
      :skills="config.skills"
    />

    <SelectedWorkSection
      section-id="work"
      eyebrow="Portfolio"
      title="Selected Works"
      description="Curated visual and cross-disciplinary highlights presented in an editorial format."
      cta-label="View All Works"
      :projects="selectedWorks"
      :show-view-all-button="true"
      @navigate="emit('navigate', 'gallery')"
      @open="emit('open-project', $event)"
    />

    <SelectedWorkSection
      section-id="projects"
      eyebrow="Featured"
      title="Project Highlights"
      description="Focused case studies across identity systems, release visuals, and digital product work."
      :projects="projectHighlights"
      :show-view-all-button="false"
      @open="emit('open-project', $event)"
    />

    <ArtistsSection :artists="artists" @open="emit('open-artist', $event)" />

    <ContactSection :email="config.email" :socials="config.socials" />
  </main>
</template>

<script setup>
import { computed } from 'vue';
import AboutSection from '../components/sections/AboutSection.vue';
import ArtistsSection from '../components/sections/ArtistsSection.vue';
import ContactSection from '../components/sections/ContactSection.vue';
import HeroSection from '../components/sections/HeroSection.vue';
import SelectedWorkSection from '../components/sections/SelectedWorkSection.vue';

const emit = defineEmits(['navigate', 'open-artist', 'open-project']);

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
  projects: {
    type: Array,
    default: () => []
  },
  topProjects: {
    type: Array,
    default: () => []
  }
});

const heroProject = computed(() => props.featuredProjects[0] || props.topProjects[0] || null);

function findById(id) {
  return props.projects.find((project) => project.id === id);
}

const selectedWorks = computed(() => {
  const preferredIds = ['artwork-001', 'artwork-029', 'artwork-025', 'artwork-003'];
  const selected = preferredIds.map(findById).filter(Boolean);

  if (selected.length >= 4) return selected.slice(0, 4);

  const fallback = props.featuredProjects.filter((project) => !selected.includes(project) && project.id !== 'project-002');
  return [...selected, ...fallback].slice(0, 4);
});

const projectHighlights = computed(() => {
  const base = props.topProjects.slice(0, 3);
  const pareidolia = findById('project-002');

  if (!pareidolia || base.some((project) => project.id === pareidolia.id)) {
    return base;
  }

  return [...base, pareidolia];
});
</script>
