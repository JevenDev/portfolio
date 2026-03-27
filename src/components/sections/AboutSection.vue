<template>
  <section id="about" class="section-shell">
    <div ref="root" class="section-wrap space-y-10">
      <div class="grid gap-8 border-b border-line pb-10 md:grid-cols-[minmax(0,1fr)_minmax(240px,320px)] md:items-end">
        <div class="space-y-5">
          <p class="eyebrow-label" data-reveal>Positioning</p>
          <h2 class="max-w-5xl font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-ink md:text-7xl">
            Designer First.
            <br />
            Producer Integrated.
          </h2>
          <p class="editorial-lead" data-reveal>{{ headline }}</p>
        </div>

        <div class="frame-block bg-shell p-5 md:p-6" data-reveal>
          <p class="eyebrow-label">Based In</p>
          <p class="mt-2 font-display text-2xl font-semibold tracking-[-0.02em] text-ink">{{ location }}</p>
          <p class="mt-3 text-base leading-relaxed text-muted">
            Visual direction and audio production for artists, releases, and digital experiences.
          </p>
        </div>
      </div>

      <div class="space-y-8">
        <div class="max-w-3xl space-y-5 text-base leading-relaxed text-ink/90 md:text-lg" data-reveal>
          <p v-for="(paragraph, index) in paragraphs" :key="`about-paragraph-${index}`">{{ paragraph }}</p>
        </div>

        <div class="frame-block p-5 md:p-6" data-reveal>
          <p class="eyebrow-label">Capabilities</p>
          <ul class="mt-4 flex flex-wrap gap-2">
            <li
              v-for="skill in skills"
              :key="skill"
              class="rounded-full border border-line bg-paper px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-ink/90"
            >
              {{ skill }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useScrollReveal } from '../../composables/useScrollReveal';

const props = defineProps({
  body: {
    type: String,
    default: ''
  },
  headline: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  skills: {
    type: Array,
    default: () => []
  }
});

const paragraphs = computed(() =>
  props.body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
);

const root = ref(null);
useScrollReveal(root);
</script>

