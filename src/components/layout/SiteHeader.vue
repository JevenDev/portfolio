<template>
  <header class="site-header">
    <RouterLink to="/" class="site-header__brand" aria-label="JVN Graphics home">
      <span aria-hidden="true">✣</span>
      <strong>Jeven Randhawa</strong>
    </RouterLink>

    <nav class="site-header__nav" aria-label="Primary navigation">
      <RouterLink
        v-for="item in navItems"
        :key="item.label"
        :to="item.to"
        :class="{ 'site-header__nav-link--active': isActive(item) }"
      >
        {{ item.label }}
      </RouterLink>
    </nav>

    <p class="site-header__location meta-type">Design + sound<br />Ontario, Canada</p>

    <button
      type="button"
      class="site-header__menu"
      :aria-expanded="String(menuOpen)"
      aria-controls="mobile-navigation"
      @click="menuOpen = !menuOpen"
    >
      {{ menuOpen ? 'Close' : 'Menu' }}
    </button>

    <Transition name="menu-fade">
      <nav v-if="menuOpen" id="mobile-navigation" class="site-header__mobile" aria-label="Mobile navigation">
        <RouterLink v-for="item in navItems" :key="item.label" :to="item.to" @click="menuOpen = false">
          {{ item.label }}
        </RouterLink>
      </nav>
    </Transition>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const menuOpen = ref(false);
const route = useRoute();
const navItems = [
  { label: 'Work', to: '/#outputs' },
  { label: 'About', to: '/#profile' },
  { label: 'Archive', to: '/archive' },
  { label: 'Contact', to: '/#contact' }
];

function isActive(item) {
  if (item.to === '/archive') return route.path === '/archive';
  if (route.path !== '/') return false;
  const targetHash = item.to.includes('#') ? `#${item.to.split('#')[1]}` : '';
  return route.hash ? route.hash === targetHash : item.label === 'Work';
}
</script>

<style scoped>
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 80;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: var(--header-height);
  border-bottom: 1px solid var(--rule);
  background: rgba(255, 254, 248, 0.96);
  padding-inline: clamp(1.25rem, 3vw, 3rem);
}

.site-header__brand {
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.92rem;
}

.site-header__brand span {
  color: var(--blue);
  font-size: 1.1rem;
}

.site-header__brand strong {
  font-weight: 560;
}

.site-header__nav {
  display: flex;
  gap: 1.8rem;
  align-items: center;
}

.site-header__nav a {
  border-bottom: 1px solid transparent;
  padding-block: 0.25rem;
  color: var(--ink-soft);
  font-size: 0.78rem;
  transition: border-color 150ms ease, color 150ms ease;
}

.site-header__nav a:hover,
.site-header__nav a:focus-visible,
.site-header__nav a.site-header__nav-link--active {
  border-color: currentColor;
  color: var(--black);
}

.site-header__location {
  justify-self: end;
  margin: 0;
  color: var(--ink-soft);
  text-align: right;
}

.site-header__menu {
  display: none;
  justify-self: end;
  border: 0;
  border-bottom: 1px solid currentColor;
  background: transparent;
  padding: 0.25rem 0;
  color: var(--black);
  font-size: 0.78rem;
}

.site-header__mobile {
  position: absolute;
  inset: 100% 0 auto;
  display: grid;
  border-bottom: 1px solid var(--rule);
  background: var(--paper-cool);
  padding: 1.25rem;
}

.site-header__mobile a {
  border-bottom: 1px solid var(--rule);
  padding: 0.8rem 0;
  font-size: 1.35rem;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 140ms ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

@media (max-width: 820px) {
  .site-header {
    grid-template-columns: 1fr auto;
  }

  .site-header__nav,
  .site-header__location {
    display: none;
  }

  .site-header__menu {
    display: block;
  }
}
</style>
