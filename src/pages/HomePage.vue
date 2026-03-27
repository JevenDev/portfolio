<template>
  <main class="pt-16 md:pt-[6.5rem]">
    <HeroSection
      :name="'Jeven Randhawa'"
      :tagline="config.tagline"
      :location="config.location"
      @navigate="emit('navigate', $event)"
    />

    <SelectedWorkSection
      section-id="projects"
      eyebrow="Projects"
      title="Top Projects"
      description="Featured project builds across design, UI/UX, and production."
      :projects="topProjects"
      :show-view-all-button="false"
      @open="emit('open-project', $event)"
    />

    <SelectedWorkSection
      section-id="work"
      eyebrow="Portfolio"
      title="Selected Works"
      description="Curated visual and cross-disciplinary highlights."
      cta-label="View All Works"
      :projects="featuredProjects"
      :show-view-all-button="true"
      @navigate="emit('navigate', 'gallery')"
      @open="emit('open-project', $event)"
    />

    <MusicSection :projects="musicProjects" @open="emit('open-project', $event)" />

    <ArtistsSection :artists="artists" @open="emit('open-artist', $event)" />

    <AboutSection
      :headline="config.aboutHeadline"
      :body="config.aboutBody"
      :location="config.location"
      :skills="config.skills"
    />

    <ContactSection :email="config.email" :socials="config.socials" />
  </main>
</template>

<script setup>
import AboutSection from '../components/sections/AboutSection.vue';
import ArtistsSection from '../components/sections/ArtistsSection.vue';
import ContactSection from '../components/sections/ContactSection.vue';
import HeroSection from '../components/sections/HeroSection.vue';
import MusicSection from '../components/sections/MusicSection.vue';
import SelectedWorkSection from '../components/sections/SelectedWorkSection.vue';

defineProps({
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
  musicProjects: {
    type: Array,
    default: () => []
  },
  topProjects: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['navigate', 'open-artist', 'open-project']);
</script>
