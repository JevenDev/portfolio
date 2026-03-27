<template>
  <section id="hero" class="section-shell border-b-0 pt-36 md:pt-44">
    <div ref="root" class="section-wrap grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
      <div class="space-y-6">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted" data-reveal>
          Graphic Design + Music Production
        </p>

        <h1
          ref="titleRef"
          class="max-w-4xl font-display text-5xl font-semibold leading-[0.97] tracking-[-0.04em] text-ink sm:text-6xl lg:text-8xl"
        >
          {{ name }}
        </h1>

        <p class="max-w-xl text-base leading-relaxed text-muted md:text-lg" data-reveal>
          {{ tagline }}
        </p>

        <div class="flex flex-wrap gap-3" data-reveal>
          <button
            type="button"
            class="focus-ring border border-ink bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-paper hover:text-ink"
            @click="emit('navigate', 'work')"
          >
            View Selected Work
          </button>
          <button
            type="button"
            class="focus-ring border border-line px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-ink/40"
            @click="emit('navigate', 'contact')"
          >
            Contact
          </button>
        </div>
      </div>

      <div class="space-y-6 border border-line bg-shell p-6 md:p-8" data-reveal>
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Based in</p>
        <p class="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">{{ location }}</p>
        <p class="text-sm leading-relaxed text-muted">
          Designer-first practice focused on identity, cover art, and visual systems, with production experience that
          supports artist projects from concept through release.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '../../composables/useScrollReveal';
import { useSplitHeading } from '../../composables/useSplitHeading';

defineProps({
  location: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: 'Jeven Randhawa'
  },
  tagline: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['navigate']);

const root = ref(null);
const titleRef = ref(null);

useScrollReveal(root);
useSplitHeading(titleRef, root);
</script>