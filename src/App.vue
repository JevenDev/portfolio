<template>
  <div class="app-shell">
    <a href="#main-content" class="skip-link" @click="skipToContent">Skip to content</a>
    <p class="sr-only" aria-live="polite" aria-atomic="true">{{ routeAnnouncement }}</p>
    <SiteHeader />

    <RouterView v-slot="{ Component }">
      <Transition name="route-shift" mode="out-in">
        <component
          :is="Component"
          :key="route.path"
          :artists="artists"
          :config="config"
          :featured-projects="featuredProjects"
          :mods="mods"
          :projects="projects"
          :data-route-name="route.name"
        />
      </Transition>
    </RouterView>

    <SiteFooter :email="config.email" :socials="config.socials" />
    <BackToTop :visible="showBackToTop" @to-top="scrollTop" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import SiteFooter from './components/layout/SiteFooter.vue';
import SiteHeader from './components/layout/SiteHeader.vue';
import BackToTop from './components/ui/BackToTop.vue';
import { usePortfolioData } from './composables/usePortfolioData';

const route = useRoute();
const { artists, config, featuredProjects, mods, projects } = usePortfolioData();
const routeAnnouncement = ref('');
const showBackToTop = ref(false);
let routeAnnouncementTimer = null;
let routeFocusRequest = 0;

watch(() => route.path, (path, previousPath) => {
  if (!previousPath || path === previousPath) return;

  const request = ++routeFocusRequest;
  focusRouteWhenReady(request, String(route.name || ''), 0);
});

function focusRouteWhenReady(request, routeName, attempt) {
  if (request !== routeFocusRequest) return;

  const main = document.querySelector(`#main-content[data-route-name="${routeName}"]`);
  if (!main && attempt < 60) {
    window.clearTimeout(routeAnnouncementTimer);
    routeAnnouncementTimer = window.setTimeout(() => focusRouteWhenReady(request, routeName, attempt + 1), 50);
    return;
  }

  if (main) {
    routeAnnouncement.value = document.title;
    main.focus({ preventScroll: true });
  }
}

function skipToContent(event) {
  event.preventDefault();
  const main = document.querySelector('#main-content');
  if (!main) return;

  main.focus({ preventScroll: true });
  main.scrollIntoView({ block: 'start' });
  window.history.replaceState(null, '', '#main-content');
}

function onScroll() {
  showBackToTop.value = window.scrollY > 720;
}

function scrollTop() {
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });
}

onMounted(() => {
  routeAnnouncement.value = document.title;
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

onUnmounted(() => {
  window.clearTimeout(routeAnnouncementTimer);
  window.removeEventListener('scroll', onScroll);
});
</script>

<style>
.app-shell {
  min-height: 100vh;
  background: var(--paper);
}

.route-shift-enter-active,
.route-shift-leave-active {
  transition: opacity 140ms linear;
}

.route-shift-enter-from,
.route-shift-leave-to {
  opacity: 0;
}
</style>
