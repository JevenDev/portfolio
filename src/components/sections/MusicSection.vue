<template>
  <section id="music" class="section-shell">
    <div ref="root" class="section-wrap">
      <SectionHeading
        eyebrow="Producer Work"
        title="Music Production"
        description="Selected production and engineering contributions integrated into artist and release visuals."
      />

      <div class="grid gap-4 md:grid-cols-2" data-reveal>
        <button
          v-for="project in projects"
          :key="`music-${project.id}`"
          type="button"
          class="focus-ring group border border-line bg-paper p-5 text-left transition hover:border-ink/30"
          @click="emit('open', project)"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.15em] text-muted">{{ project.year }}</p>
          <h3 class="mt-2 font-display text-2xl font-semibold tracking-[-0.02em] text-ink">{{ project.title }}</h3>
          <p v-if="project.role" class="mt-3 text-sm text-muted">{{ project.role }}</p>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '../../composables/useScrollReveal';
import SectionHeading from '../ui/SectionHeading.vue';

defineProps({
  projects: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['open']);

const root = ref(null);
useScrollReveal(root);
</script>