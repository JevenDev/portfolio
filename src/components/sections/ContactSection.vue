<template>
  <section id="contact" class="section-shell border-b-0">
    <div ref="root" class="section-wrap">
      <article class="frame-block overflow-hidden">
        <div class="grid gap-8 border-b border-line p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:p-8">
          <div class="space-y-4">
            <p class="eyebrow-label" data-reveal>Contact</p>
            <h2 class="max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-ink md:text-7xl">
              Let's Build Work
              <br />
              That Looks and Sounds Distinct.
            </h2>
            <p class="editorial-lead" data-reveal>
              Available for visual identity, cover art direction, and production support.
            </p>
          </div>

          <a
            :href="`mailto:${email}`"
            class="focus-ring inline-flex items-center justify-center border border-ink bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-paper hover:text-ink"
            data-reveal
          >
            Email Me Directly
          </a>
        </div>

        <div class="space-y-5 p-6 md:p-8">
          <div class="space-y-2" data-reveal>
            <p class="text-base leading-relaxed text-ink/90 md:text-lg">
              For commissions, collaborations, or role opportunities, email directly or connect through socials.
            </p>
            <p class="text-base text-muted">Typically respond within 24 to 48 hours.</p>
            <ul class="pt-1 flex flex-wrap gap-3" data-reveal>
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
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '../../composables/useScrollReveal';

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

