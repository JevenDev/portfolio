<template>
  <header class="fixed inset-x-0 top-0 z-40 border-b border-line bg-paper/95 backdrop-blur md:top-9">
    <div class="section-wrap flex h-16 items-center justify-between md:h-[4.25rem]">
      <button
        type="button"
        class="focus-ring font-display text-base font-semibold uppercase tracking-[0.14em] text-ink"
        @click="onNavigate('hero')"
      >
        JVN Graphics
      </button>

      <nav aria-label="Primary" class="hidden items-center gap-7 md:flex">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="focus-ring border-b border-transparent pb-1 text-xs font-semibold uppercase tracking-[0.16em] transition"
          :class="activeSection === item.id ? 'border-ink text-ink' : 'text-muted hover:text-ink'"
          @click="onNavigate(item.id)"
        >
          {{ item.label }}
        </button>
      </nav>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="focus-ring hidden border border-ink px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-ink hover:text-paper md:inline-flex"
          @click="onNavigate('contact')"
        >
          Contact
        </button>

        <button
          type="button"
          class="focus-ring inline-flex h-9 w-9 items-center justify-center border border-line text-ink md:hidden"
          :aria-expanded="String(menuOpen)"
          aria-label="Toggle navigation"
          @click="menuOpen = !menuOpen"
        >
          <span class="text-lg leading-none">{{ menuOpen ? '×' : '+' }}</span>
        </button>
      </div>
    </div>

    <transition name="menu">
      <nav v-if="menuOpen" class="border-t border-line bg-paper p-5 md:hidden">
        <ul class="space-y-3">
          <li v-for="item in navItems" :key="`mobile-${item.id}`">
            <button
              type="button"
              class="focus-ring w-full border border-line px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-ink"
              @click="onNavigate(item.id)"
            >
              {{ item.label }}
            </button>
          </li>
          <li>
            <button
              type="button"
              class="focus-ring w-full border border-ink px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-ink"
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
  { id: 'gallery', label: 'Full Gallery' },
  { id: 'music', label: 'Production' },
  { id: 'artists', label: 'Artists' },
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