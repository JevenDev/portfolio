<template>
  <div class="app-shell">
    <a href="#main-content" class="skip-link">Skip to content</a>
    <SiteHeader />

    <RouterView v-slot="{ Component }">
      <Transition name="route-shift" mode="out-in">
        <component
          :is="Component"
          :key="route.fullPath"
          :artists="artists"
          :config="config"
          :featured-projects="featuredProjects"
          :projects="projects"
        />
      </Transition>
    </RouterView>

    <SiteFooter :email="config.email" :socials="config.socials" />
    <BackToTop :visible="showBackToTop" @to-top="scrollTop" />
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import SiteFooter from './components/layout/SiteFooter.vue';
import SiteHeader from './components/layout/SiteHeader.vue';
import BackToTop from './components/ui/BackToTop.vue';
import { usePortfolioData } from './composables/usePortfolioData';

const route = useRoute();
const { artists, config, featuredProjects, projects } = usePortfolioData();
const showBackToTop = ref(false);

function onScroll() {
  showBackToTop.value = window.scrollY > 720;
}

function scrollTop() {
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });
}

watch(
  () => route.fullPath,
  async () => {
    await nextTick();
    window.requestAnimationFrame(() => {
      const target = route.hash ? document.querySelector(route.hash) : null;
      const top = target ? target.getBoundingClientRect().top + window.scrollY - 72 : 0;
      window.scrollTo({ top, behavior: 'auto' });
    });
  }
);

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

onUnmounted(() => {
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
