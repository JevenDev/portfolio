<template>
  <section id="contact" class="section-shell border-b-0">
    <div ref="root" class="section-wrap">
      <SectionHeading
        eyebrow="Contact"
        title="Let's Build Something That Looks and Sounds Distinct"
        description="Available for visual identity, cover art direction, and production support."
      />

      <div class="grid gap-6 border border-line bg-shell p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8" data-reveal>
        <div class="space-y-3">
          <p class="text-base leading-relaxed text-ink/90 md:text-lg">
            For commissions, collaborations, or role opportunities, email me directly or connect through socials.
          </p>
          <p class="text-sm text-muted">Response window: typically within 24-48 hours.</p>
        </div>

        <a
          :href="`mailto:${email}`"
          class="focus-ring inline-flex items-center justify-center border border-ink bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-paper hover:text-ink"
        >
          Email Me Directly
        </a>
      </div>

      <ul class="mt-6 flex flex-wrap gap-3" data-reveal>
        <li v-for="social in socials" :key="social.url">
          <a
            :href="social.url"
            target="_blank"
            rel="noreferrer"
            class="focus-ring inline-flex border border-line px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-ink/40"
          >
            {{ social.label }}
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '../../composables/useScrollReveal';
import SectionHeading from '../ui/SectionHeading.vue';

defineProps({
  email: {
    type: String,
    default: ''
  },
  socials: {
    type: Array,
    default: () => []
  }
});

const root = ref(null);
useScrollReveal(root);
</script>