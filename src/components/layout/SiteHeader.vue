<template>
  <header class="fixed inset-x-0 top-0 z-40 border-b border-line/90 bg-paper/95 backdrop-blur md:top-8">
    <div class="section-wrap flex h-14 items-center justify-between md:h-[3.75rem]">
      <button
        type="button"
        class="focus-ring font-display text-sm font-semibold uppercase leading-none tracking-[0.14em] text-ink"
        @click="onNavigate('hero')"
      >
        JVN Graphics
      </button>

      <nav aria-label="Primary" class="hidden items-center gap-6 lg:flex">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="focus-ring border-b border-transparent pb-[0.2rem] text-xs font-semibold uppercase leading-none tracking-[0.16em] transition"
          :class="activeSection === item.id ? 'border-ink text-ink' : 'text-muted hover:text-ink'"
          @click="onNavigate(item.id)"
        >
          {{ item.label }}
        </button>
      </nav>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="focus-ring hidden text-xs font-semibold uppercase tracking-[0.16em] text-muted transition hover:text-ink md:inline-flex"
          @click="onNavigate('contact')"
        >
          Contact
        </button>

        <button
          type="button"
          class="focus-ring inline-flex h-8 w-8 items-center justify-center border border-line text-ink lg:hidden"
          :aria-expanded="String(menuOpen)"
          aria-label="Toggle navigation"
          @click="menuOpen = !menuOpen"
        >
          <span class="text-base leading-none">{{ menuOpen ? 'x' : '+' }}</span>
        </button>
      </div>
    </div>

    <transition name="menu">
      <nav v-if="menuOpen" class="border-t border-line bg-paper px-5 py-4 lg:hidden">
        <ul class="space-y-2">
          <li v-for="item in navItems" :key="`mobile-${item.id}`">
            <button
              type="button"
              class="focus-ring w-full border border-line px-4 py-2.5 text-left text-xs font-semibold uppercase leading-none tracking-[0.16em] text-ink"
              @click="onNavigate(item.id)"
            >
              {{ item.label }}
            </button>
          </li>
          <li>
            <button
              type="button"
              class="focus-ring w-full border border-ink px-4 py-2.5 text-left text-xs font-semibold uppercase leading-none tracking-[0.16em] text-ink"
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

