<template>
  <section id="hero" class="section-shell border-b-0 py-0">
    <div ref="root" class="section-wrap-wide">
      <div class="frame-block">
        <div class="grid gap-7 border-b border-line px-5 pb-10 pt-14 md:grid-cols-[1fr_auto] md:gap-8 md:px-8 md:pb-12 md:pt-16">
          <div class="space-y-4">
            <p class="eyebrow-label" data-reveal>Graphic Designer + Producer</p>
            <p class="max-w-[32rem] text-base leading-relaxed text-muted md:text-lg" data-reveal>
              Designer-first visual work rooted in release culture, artist branding, and digital composition.
            </p>
          </div>

          <div class="flex flex-wrap items-start gap-3 md:justify-end" data-reveal>
            <button
              type="button"
              class="focus-ring border border-ink bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-paper hover:text-ink"
              @click="emit('navigate', 'work')"
            >
              View Selected Work
            </button>
            <button
              type="button"
              class="focus-ring border border-line px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-ink/40"
              @click="emit('navigate', 'contact')"
            >
              Start a Project
            </button>
          </div>

          <h1
            ref="titleRef"
            class="hero-title md:col-span-2 max-w-[19ch] font-display text-[clamp(3rem,11vw,11.5rem)] font-semibold uppercase leading-[0.89] tracking-[-0.05em] text-ink"
          >
            {{ name }}
          </h1>

          <p class="md:col-span-2 max-w-[48rem] text-base leading-relaxed text-muted md:text-lg" data-reveal>
            {{ tagline }}
          </p>
        </div>

        <div class="space-y-4 p-3 md:p-4">
          <button
            v-if="heroProject"
            type="button"
            class="focus-ring group block w-full text-left"
            :aria-label="`Open details for ${heroProject.title}`"
            @click="emit('open-project', heroProject)"
          >
            <figure class="overflow-hidden border border-line bg-shell" data-speed="0.96">
              <img
                :src="heroProject.thumb"
                :alt="heroProject.title"
                class="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.015]"
                decoding="async"
                fetchpriority="high"
              />
            </figure>
          </button>

          <div class="grid gap-4 px-2 pb-2 md:grid-cols-[1fr_auto] md:items-end md:gap-8 md:px-3">
            <div data-reveal>
              <p class="eyebrow-label">Featured Right Now</p>
              <p class="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-ink md:text-4xl">
                {{ heroProject?.title || 'Featured Work' }}
              </p>
              <p class="mt-2 text-base leading-relaxed text-muted">
                {{ heroProject?.role || 'i just really do, ya know?' }}
              </p>
            </div>

            <div class="space-y-2 md:text-right" data-reveal>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{{ location }}</p>
              <p v-if="heroProject?.year" class="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                {{ heroProject.year }}
              </p>
              <button
                v-if="heroProject"
                type="button"
                class="focus-ring mt-2 border border-line px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-ink/40"
                @click="emit('open-project', heroProject)"
              >
                Open Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '../../composables/useScrollReveal';
import { useSplitHeading } from '../../composables/useSplitHeading';

defineProps({
  heroProject: {
    type: Object,
    default: null
  },
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

const emit = defineEmits(['navigate', 'open-project']);

const root = ref(null);
const titleRef = ref(null);

useScrollReveal(root);
useSplitHeading(titleRef, root);
</script>

<style scoped>
.hero-title :deep(.split-line) {
  padding-bottom: 0.02em;
}
</style>

