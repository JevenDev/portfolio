<template>
  <div class="bg-paper">
    <TopTicker :skills="config.skills" :interval-ms="config.tickerIntervalMs" />
    <SiteHeader :active-section="activeSection" @navigate="scrollToSection" />

    <main ref="mainRef" class="pt-16 md:pt-[6.5rem]">
      <HeroSection
        :name="'Jeven Randhawa'"
        :tagline="config.tagline"
        :location="config.location"
        @navigate="scrollToSection"
      />

      <SelectedWorkSection :projects="featuredProjects" @navigate="scrollToSection" @open="openProject" />

      <WorkGallerySection
        :projects="filteredSortedProjects"
        :active-tags="activeTags"
        :visible-tags="visibleFilterTags"
        :sort-by="sortBy"
        @toggle-tag="toggleTag"
        @update-sort="sortBy = $event"
        @open="openProject"
      />

      <MusicSection :projects="musicProjects" @open="openProject" />

      <ArtistsSection :artists="artists" @open="openArtist" />

      <AboutSection
        :headline="config.aboutHeadline"
        :body="config.aboutBody"
        :location="config.location"
        :skills="config.skills"
      />

      <ContactSection :email="config.email" :socials="config.socials" />
    </main>

    <SiteFooter />

    <DetailModal :open="Boolean(modalItem)" :item="modalItem" :mode="modalMode" @close="closeModal" />

    <BackToTop :visible="showBackToTop" @to-top="scrollToSection('hero')" />
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import AboutSection from './components/sections/AboutSection.vue';
import ArtistsSection from './components/sections/ArtistsSection.vue';
import ContactSection from './components/sections/ContactSection.vue';
import HeroSection from './components/sections/HeroSection.vue';
import MusicSection from './components/sections/MusicSection.vue';
import SelectedWorkSection from './components/sections/SelectedWorkSection.vue';
import WorkGallerySection from './components/sections/WorkGallerySection.vue';
import SiteFooter from './components/layout/SiteFooter.vue';
import SiteHeader from './components/layout/SiteHeader.vue';
import TopTicker from './components/layout/TopTicker.vue';
import BackToTop from './components/ui/BackToTop.vue';
import DetailModal from './components/ui/DetailModal.vue';
import { usePortfolioData } from './composables/usePortfolioData';
import { ScrollTrigger, gsap } from './utils/gsap';

const {
  activeTags,
  artists,
  config,
  featuredProjects,
  filteredSortedProjects,
  musicProjects,
  projects,
  sortBy,
  toggleTag,
  visibleFilterTags
} = usePortfolioData();

const mainRef = ref(null);
const activeSection = ref('hero');
const showBackToTop = ref(false);
const modalItem = ref(null);
const modalMode = ref('project');

let ctx;

function getHeaderOffset() {
  return window.innerWidth >= 768 ? 104 : 74;
}

function scrollToSection(sectionId) {
  if (modalItem.value) {
    closeModal();
  }

  const target = document.getElementById(sectionId);
  if (!target) return;

  const offsetY = getHeaderOffset();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    const top = target.getBoundingClientRect().top + window.scrollY - offsetY;
    window.scrollTo({ top, behavior: 'auto' });
    return;
  }

  gsap.to(window, {
    duration: 0.9,
    ease: 'power3.out',
    scrollTo: {
      autoKill: true,
      offsetY,
      y: target
    }
  });
}

function openProject(project) {
  modalItem.value = project;
  modalMode.value = 'project';
  history.replaceState(null, '', `#project=${encodeURIComponent(project.id)}`);
}

function openArtist(artist) {
  modalItem.value = artist;
  modalMode.value = 'artist';
  if (window.location.hash.startsWith('#project=')) {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }
}

function closeModal() {
  modalItem.value = null;

  if (window.location.hash.startsWith('#project=')) {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }
}

function setupScrollState() {
  ctx = gsap.context(() => {
    const sections = gsap.utils.toArray('main section[id]');

    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (trigger) => {
          if (trigger.isActive) {
            activeSection.value = section.id;
          }
        }
      });
    });

    ScrollTrigger.create({
      trigger: 'main',
      start: 'top -35%',
      onUpdate: (trigger) => {
        showBackToTop.value = trigger.progress > 0.05;
      }
    });
  }, mainRef);
}

function handleInitialHash() {
  const hash = window.location.hash;

  if (!hash) return;

  const projectMatch = hash.match(/^#project=(.+)$/);
  if (projectMatch) {
    const projectId = decodeURIComponent(projectMatch[1]);
    const matched = projects.value.find((project) => project.id === projectId);
    if (matched) {
      scrollToSection('work');
      openProject(matched);
    }
    return;
  }

  const section = hash.replace('#', '');
  if (section) {
    scrollToSection(section);
  }
}

onMounted(async () => {
  await nextTick();
  setupScrollState();
  handleInitialHash();
});

onUnmounted(() => {
  ctx?.revert();
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});
</script>
