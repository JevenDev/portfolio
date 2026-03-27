<template>
  <section id="about" class="section-shell">
    <div ref="root" class="section-wrap grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start lg:gap-10">
      <div>
        <SectionHeading eyebrow="About" title="Designer First, Producer Integrated" :description="headline" />

        <div class="max-w-3xl space-y-5 text-base leading-relaxed text-ink/90 md:text-lg" data-reveal>
          <p v-for="(paragraph, index) in paragraphs" :key="`about-paragraph-${index}`">{{ paragraph }}</p>
        </div>
      </div>

      <aside class="w-full max-w-[340px] justify-self-end space-y-5 border border-line bg-shell p-5 md:p-6" data-reveal>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Location</p>
          <p class="mt-1 text-lg font-semibold text-ink">{{ location }}</p>
        </div>

        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Capabilities</p>
          <ul class="mt-3 space-y-2 text-sm text-ink/90">
            <li v-for="skill in skills" :key="skill">{{ skill }}</li>
          </ul>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useScrollReveal } from '../../composables/useScrollReveal';
import SectionHeading from '../ui/SectionHeading.vue';

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
