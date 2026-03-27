<template>
  <div class="bg-paper">
    <TopTicker :skills="config.skills" :interval-ms="config.tickerIntervalMs" />
    <SiteHeader :active-section="activeSection" @navigate="handleNavigation" />

    <RouterView v-slot="{ Component }">
      <component
        :is="Component"
        :artists="artists"
        :config="config"
        :featured-projects="featuredProjects"
        :music-projects="musicProjects"
        :top-projects="topProjects"
        :projects="filteredSortedProjects"
        :active-tags="activeTags"
        :visible-tags="visibleFilterTags"
        :sort-by="sortBy"
        @navigate="handleNavigation"
        @open-project="openProject"
        @open-artist="openArtist"
        @toggle-tag="toggleTag"
        @update-sort="sortBy = $event"
      />
    </RouterView>

    <SiteFooter :socials="config.socials" />

    <DetailModal :open="Boolean(modalItem)" :item="modalItem" :mode="modalMode" @close="closeModal" />

    <BackToTop :visible="showBackToTop" @to-top="handleBackToTop" />
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import SiteFooter from './components/layout/SiteFooter.vue';
import SiteHeader from './components/layout/SiteHeader.vue';
import TopTicker from './components/layout/TopTicker.vue';
import BackToTop from './components/ui/BackToTop.vue';
import DetailModal from './components/ui/DetailModal.vue';
import { usePortfolioData } from './composables/usePortfolioData';
import { gsap } from './utils/gsap';

const route = useRoute();
const router = useRouter();

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
  topProjects,
  visibleFilterTags
} = usePortfolioData();

const activeSection = ref(route.path === '/gallery' ? 'gallery' : 'hero');
const showBackToTop = ref(false);
const modalItem = ref(null);
const modalMode = ref('project');
let galleryPrefetchPromise = null;
let idlePrefetchId = null;

let sectionObserver;

function getHeaderOffset() {
  return window.innerWidth >= 768 ? 116 : 74;
}

function prefetchGalleryRoute() {
  if (!galleryPrefetchPromise) {
    galleryPrefetchPromise = import('./pages/GalleryPage.vue');
  }

  return galleryPrefetchPromise;
}

function scrollToSection(sectionId) {
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
    duration: 0.85,
    ease: 'power3.out',
    scrollTo: {
      autoKill: true,
      offsetY,
      y: target
    }
  });
}

function scrollPageTop() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }

  gsap.to(window, {
    duration: 0.75,
    ease: 'power3.out',
    scrollTo: {
      autoKill: true,
      y: 0
    }
  });
}

async function handleNavigation(target) {
  if (target === 'gallery') {
    await prefetchGalleryRoute();

    if (route.path !== '/gallery') {
      await router.push('/gallery');
    }
    activeSection.value = 'gallery';
    scrollPageTop();
    return;
  }

  if (target === 'hero' && route.path === '/gallery') {
    await router.push('/');
    return;
  }

  if (route.path !== '/') {
    await router.push({ path: '/', hash: `#${target}` });
    return;
  }

  if (route.hash !== `#${target}`) {
    await router.replace({ path: '/', hash: `#${target}` });
  }

  activeSection.value = target;
  scrollToSection(target);
}

async function openProject(project, options = { updateHash: true }) {
  modalItem.value = project;
  modalMode.value = 'project';

  if (options.updateHash) {
    await router.replace({ path: route.path, hash: `#project=${encodeURIComponent(project.id)}` });
  }
}

async function openArtist(artist) {
  modalItem.value = artist;
  modalMode.value = 'artist';

  if (route.hash.startsWith('#project=')) {
    await router.replace({ path: route.path, hash: '' });
  }
}

async function closeModal() {
  modalItem.value = null;

  if (route.hash.startsWith('#project=')) {
    await router.replace({ path: route.path, hash: '' });
  }
}

function setupSectionObserver() {
  sectionObserver?.disconnect();

  if (route.path !== '/') {
    activeSection.value = 'gallery';
    return;
  }

  const sections = Array.from(document.querySelectorAll('main section[id]'));
  if (!sections.length) return;

  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id;
        }
      });
    },
    {
      rootMargin: '-35% 0px -50% 0px',
      threshold: [0.2, 0.5, 0.8]
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function onScroll() {
  showBackToTop.value = window.scrollY > 420;
}

async function syncFromRoute() {
  if (!route.hash) {
    if (route.path === '/gallery') {
      activeSection.value = 'gallery';
    }
    return;
  }

  if (route.hash.startsWith('#project=')) {
    const projectId = decodeURIComponent(route.hash.replace('#project=', ''));
    const matchedProject = projects.value.find((project) => project.id === projectId);

    if (matchedProject) {
      await openProject(matchedProject, { updateHash: false });
    }
    return;
  }

  if (route.path !== '/') return;

  const sectionId = route.hash.replace('#', '');
  if (sectionId) {
    activeSection.value = sectionId;
    scrollToSection(sectionId);
  }
}

async function handleBackToTop() {
  if (route.path === '/gallery') {
    scrollPageTop();
    return;
  }

  await handleNavigation('hero');
}

watch(
  () => route.fullPath,
  async () => {
    await nextTick();
    setupSectionObserver();
    await syncFromRoute();
  }
);

onMounted(async () => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (route.path === '/') {
    if ('requestIdleCallback' in window) {
      idlePrefetchId = window.requestIdleCallback(
        () => {
          prefetchGalleryRoute();
        },
        { timeout: 1500 }
      );
    } else {
      idlePrefetchId = window.setTimeout(() => {
        prefetchGalleryRoute();
      }, 300);
    }
  }

  await nextTick();
  setupSectionObserver();
  await syncFromRoute();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  sectionObserver?.disconnect();

  if (idlePrefetchId !== null) {
    if ('cancelIdleCallback' in window) {
      window.cancelIdleCallback(idlePrefetchId);
    } else {
      window.clearTimeout(idlePrefetchId);
    }
  }
});
</script>
