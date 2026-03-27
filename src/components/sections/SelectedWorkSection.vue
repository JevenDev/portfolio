<template>
  <section :id="sectionId" class="section-shell">
    <div ref="root" class="section-wrap space-y-8">
      <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <SectionHeading :eyebrow="eyebrow" :title="title" :description="description" />

        <button
          v-if="showViewAllButton"
          type="button"
          class="focus-ring h-fit border border-line px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-ink/40"
          @click="emit('navigate', 'gallery')"
        >
          {{ ctaLabel }}
        </button>
      </div>

      <p v-if="introText" class="text-base text-muted" data-reveal>{{ introText }}</p>

      <div v-if="featuredProject" class="space-y-6">
        <article class="frame-block overflow-hidden" data-reveal>
          <div class="grid lg:grid-cols-[1.2fr_0.8fr]">
            <button
              type="button"
              class="focus-ring group block h-full border-b border-line text-left lg:border-b-0 lg:border-r"
              :aria-label="`Open details for ${featuredProject.title}`"
              @click="emit('open', featuredProject)"
            >
              <img
                :src="featuredProject.thumb"
                :alt="featuredProject.title"
                class="aspect-[4/3] h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                data-speed="0.97"
                loading="lazy"
                decoding="async"
              />
            </button>

            <div class="flex h-full flex-col justify-between gap-8 p-5 md:p-7">
              <div class="space-y-4">
                <p class="eyebrow-label">{{ featuredProject.year }}</p>
                <h3 class="font-display text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-5xl">
                  {{ featuredProject.title }}
                </h3>
                <p class="text-base leading-relaxed text-muted">
                  {{ featuredProject.role || 'Graphic Design Piece' }}
                </p>
                <ul class="flex flex-wrap gap-2">
                  <li
                    v-for="tag in featuredProject.tags?.slice(0, 4)"
                    :key="`${featuredProject.id}-${tag}`"
                    class="rounded-full border border-line px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted"
                  >
                    {{ tag }}
                  </li>
                </ul>
              </div>

              <button
                type="button"
                class="focus-ring w-fit border border-line px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-ink/40"
                @click="emit('open', featuredProject)"
              >
                View Project
              </button>
            </div>
          </div>
        </article>

        <div v-if="secondaryProjects.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="project in secondaryProjects"
            :key="project.id"
            class="frame-block group flex h-full flex-col"
            data-reveal
          >
            <button
              type="button"
              class="focus-ring block h-full text-left"
              :aria-label="`Open details for ${project.title}`"
              @click="emit('open', project)"
            >
              <img
                :src="project.thumb"
                :alt="project.title"
                class="aspect-[5/4] w-full border-b border-line object-cover transition duration-500 group-hover:scale-[1.015]"
                data-speed="0.99"
                loading="lazy"
                decoding="async"
              />
              <div class="space-y-3 p-5">
                <p class="text-xs font-semibold uppercase tracking-[0.15em] text-muted">{{ project.year }}</p>
                <h4 class="font-display text-2xl font-semibold leading-[1.12] tracking-[-0.02em] text-ink">
                  {{ project.title }}
                </h4>
                <p class="text-base text-muted">{{ project.role || 'Graphic Design Piece' }}</p>
              </div>
            </button>
          </article>
        </div>
      </div>

      <p v-else class="border border-dashed border-line p-6 text-center text-base text-muted" data-reveal>
        No work has been curated for this section yet.
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useScrollReveal } from '../../composables/useScrollReveal';
import SectionHeading from '../ui/SectionHeading.vue';

const props = defineProps({
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

const featuredProject = computed(() => props.projects[0] || null);
const secondaryProjects = computed(() => props.projects.slice(1));
</script>

