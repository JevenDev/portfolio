<template>
  <section :id="sectionId" class="section-shell">
    <div ref="root" class="section-wrap">
      <SectionHeading
        :eyebrow="eyebrow"
        :title="title"
        :description="description"
      />

      <div class="mb-8 flex flex-wrap items-center justify-between gap-3" data-reveal>
        <p v-if="introText" class="text-sm text-muted">{{ introText }}</p>
        <button
          v-if="showViewAllButton"
          type="button"
          class="focus-ring border border-line px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-ink/40"
          @click="emit('navigate', 'gallery')"
        >
          {{ ctaLabel }}
        </button>
      </div>

      <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" @open="emit('open', $event)" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '../../composables/useScrollReveal';
import ProjectCard from '../ui/ProjectCard.vue';
import SectionHeading from '../ui/SectionHeading.vue';

defineProps({
  ctaLabel: {
    type: String,
    default: 'View Full Works Gallery'
  },
  description: {
    type: String,
    default: 'A focused view of cross-disciplinary projects that combine visual identity and production work.'
  },
  eyebrow: {
    type: String,
    default: 'Portfolio'
  },
  introText: {
    type: String,
    default: ''
  },
  projects: {
    type: Array,
    default: () => []
  },
  sectionId: {
    type: String,
    default: 'work'
  },
  showViewAllButton: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: 'Selected Works'
  }
});

const emit = defineEmits(['navigate', 'open']);

const root = ref(null);
useScrollReveal(root);
</script>
