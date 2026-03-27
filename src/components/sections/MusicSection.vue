<template>
  <section id="music" class="section-shell">
    <div ref="root" class="section-wrap space-y-8">
      <SectionHeading
        eyebrow="Practice"
        title="Design and Production"
        description="A balanced view of visual direction and producer credits, presented as one connected creative practice."
      />

      <div class="grid gap-5 lg:grid-cols-2">
        <article class="frame-block p-5 md:p-6" data-reveal>
          <p class="eyebrow-label">Graphic Design Direction</p>
          <p class="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Identity, cover art, and visual storytelling developed to support each project release and artist narrative.
          </p>
          <div class="mt-5 space-y-3">
            <button
              v-for="project in designProjects.slice(0, 3)"
              :key="`design-${project.id}`"
              type="button"
              class="focus-ring block w-full border border-line p-4 text-left transition hover:border-ink/40"
              @click="emit('open', project)"
            >
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{{ project.year }}</p>
              <h3 class="mt-1 font-display text-xl font-semibold tracking-[-0.02em] text-ink">{{ project.title }}</h3>
            </button>
          </div>
        </article>

        <article class="frame-block overflow-hidden" data-reveal>
          <button
            v-if="featuredMusicProject"
            type="button"
            class="focus-ring group block h-full w-full text-left"
            :aria-label="`Open details for ${featuredMusicProject.title}`"
            @click="emit('open', featuredMusicProject)"
          >
            <img
              :src="featuredMusicProject.thumb"
              :alt="featuredMusicProject.title"
              class="aspect-[4/3] w-full border-b border-line object-cover transition duration-500 group-hover:scale-[1.015]"
              loading="lazy"
              decoding="async"
            />
            <div class="space-y-3 p-5 md:p-6">
              <p class="eyebrow-label">Producer Focus</p>
              <h3 class="font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink md:text-4xl">
                {{ featuredMusicProject.title }}
              </h3>
              <p class="text-sm text-muted">{{ featuredMusicProject.role || 'Production + Engineering' }}</p>
            </div>
          </button>
        </article>
      </div>

      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3" data-reveal>
        <button
          v-for="project in secondaryMusicProjects"
          :key="`music-${project.id}`"
          type="button"
          class="focus-ring group border border-line bg-paper p-4 text-left transition hover:border-ink/30"
          @click="emit('open', project)"
        >
          <p class="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">{{ project.year }}</p>
          <h4 class="mt-2 font-display text-2xl font-semibold tracking-[-0.02em] text-ink">{{ project.title }}</h4>
          <p v-if="project.role" class="mt-2 text-sm text-muted">{{ project.role }}</p>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useScrollReveal } from '../../composables/useScrollReveal';
import SectionHeading from '../ui/SectionHeading.vue';

const props = defineProps({
  designProjects: {
    type: Array,
    default: () => []
  },
  projects: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['open']);

const root = ref(null);
useScrollReveal(root);

const featuredMusicProject = computed(() => props.projects[0] || null);
const secondaryMusicProjects = computed(() => props.projects.slice(1, 7));
</script>
