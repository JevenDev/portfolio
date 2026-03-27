<template>
  <header class="fixed inset-x-0 top-0 z-40 border-b border-line/90 bg-paper/95 backdrop-blur md:top-8">
    <div class="relative h-14 md:h-[3.75rem]">
      <div class="section-wrap flex h-full items-center justify-between">
        <button
          type="button"
          class="focus-ring tap-target font-display text-sm font-semibold uppercase leading-none tracking-[0.14em] text-ink"
          @click="onNavigate('hero')"
        >
          JVN Graphics
        </button>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="focus-ring tap-target hidden h-11 items-center justify-center text-xs font-semibold uppercase leading-none tracking-[0.16em] text-muted transition hover:text-ink md:inline-flex"
            @click="onNavigate('contact')"
          >
            Contact
          </button>

          <button
            type="button"
            class="focus-ring inline-flex h-11 w-11 items-center justify-center border border-line text-ink lg:hidden"
            :aria-expanded="String(menuOpen)"
            aria-controls="mobile-primary-nav"
            aria-label="Toggle navigation"
            @click="menuOpen = !menuOpen"
          >
            <span class="text-base leading-none">{{ menuOpen ? 'x' : '+' }}</span>
          </button>
        </div>
      </div>

      <nav
        aria-label="Primary"
        class="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 lg:flex"
      >
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="focus-ring tap-target border-b border-transparent pb-[0.2rem] text-xs font-semibold uppercase leading-none tracking-[0.16em] transition"
          :class="activeSection === item.id ? 'border-ink text-ink' : 'text-muted hover:text-ink'"
          :aria-current="activeSection === item.id ? 'page' : undefined"
          @click="onNavigate(item.id)"
        >
          {{ item.label }}
        </button>
      </nav>
    </div>

    <transition name="menu">
      <nav id="mobile-primary-nav" v-if="menuOpen" class="border-t border-line bg-paper px-5 py-4 lg:hidden">
        <ul class="space-y-2">
          <li v-for="item in navItems" :key="`mobile-${item.id}`">
            <button
              type="button"
              class="focus-ring tap-target w-full border border-line px-4 py-2.5 text-left text-xs font-semibold uppercase leading-none tracking-[0.16em] text-ink"
              @click="onNavigate(item.id)"
            >
              {{ item.label }}
            </button>
          </li>
          <li>
            <button
              type="button"
              class="focus-ring tap-target w-full border border-ink px-4 py-2.5 text-left text-xs font-semibold uppercase leading-none tracking-[0.16em] text-ink"
              @click="onNavigate('contact')"
            >
              Contact
            </button>
          </li>
        </ul>
      </nav>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  activeSection: {
    type: String,
    default: 'hero'
  }
});

const emit = defineEmits(['navigate']);
const menuOpen = ref(false);

const navItems = [
  { id: 'work', label: 'Selected Work' },
  { id: 'projects', label: 'Featured Projects' },
  { id: 'gallery', label: 'Full Gallery' },
  { id: 'artists', label: 'Collaborators' },
  { id: 'about', label: 'About' }
];

function onNavigate(sectionId) {
  emit('navigate', sectionId);
  menuOpen.value = false;
}
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 180ms ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
</style>

