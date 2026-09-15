<template>
  <div class="app-shell">
    <a href="#main-content" class="skip-link" @click="skipToContent">Skip to content</a>
    <p class="sr-only" aria-live="polite" aria-atomic="true">{{ routeAnnouncement }}</p>
    <SiteHeader />
    <p v-if="routeLoading" class="route-status" role="status">Loading page…</p>
    <p v-if="routeErrorPath" class="route-status" role="alert">
      This page could not load. <a :href="routeErrorPath">Try again</a>
    </p>

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
    <a class="mobile-contact" :href="`mailto:${config.email}`">Get in touch <span aria-hidden="true">↗</span></a>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import SiteFooter from './components/layout/SiteFooter.vue';
import SiteHeader from './components/layout/SiteHeader.vue';
import BackToTop from './components/ui/BackToTop.vue';
import { usePortfolioData } from './composables/usePortfolioData';

const route = useRoute();
const router = useRouter();
const routeLoading = ref(false);
const routeErrorPath = ref('');
const removeBeforeHook = router.beforeEach(() => {
  routeLoading.value = true;
  routeErrorPath.value = '';
});
const removeAfterHook = router.afterEach(() => { routeLoading.value = false; });
const removeErrorHook = router.onError((error, to) => {
  routeLoading.value = false;
  routeErrorPath.value = to.fullPath;
});
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
  removeBeforeHook();
  removeAfterHook();
  removeErrorHook();
  window.clearTimeout(routeAnnouncementTimer);
  window.removeEventListener('scroll', onScroll);
});
</script>

<style>
.app-shell {
  min-height: 100vh;
  background: var(--paper);
}

.mobile-contact {
  display: none;
}

.route-status {
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  z-index: 79;
  margin: 0;
  padding: 0.75rem var(--page-gutter);
  border-bottom: 1px solid var(--rule);
  background: var(--paper-cool);
  color: var(--black);
}

.route-status a {
  text-decoration: underline;
}

@media (max-width: 820px) {
  .app-shell {
    padding-bottom: calc(3.5rem + env(safe-area-inset-bottom));
  }

  .mobile-contact {
    position: fixed;
    inset: auto 0 0;
    z-index: 70;
    display: flex;
    min-height: calc(3.5rem + env(safe-area-inset-bottom));
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--paper-cool);
    background: var(--blue);
    color: var(--paper-cool);
    padding: 0.75rem var(--page-gutter) calc(0.75rem + env(safe-area-inset-bottom));
  }
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
