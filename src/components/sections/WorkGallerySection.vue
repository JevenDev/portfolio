<template>
  <section id="gallery" class="section-shell">
    <div ref="root" class="section-wrap space-y-8">
      <SectionHeading
        eyebrow="Archive"
        title="Full Works Gallery"
        description="Browse the complete catalog, including project builds, artwork, and cover releases."
      />

      <div class="space-y-6 border border-line bg-shell p-5 md:p-6" data-reveal>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition"
            :class="activeTags.length === 0 ? 'border-ink bg-ink text-paper' : 'border-line text-ink hover:border-ink/40'"
            @click="emit('toggle-tag', 'all')"
          >
            All Tags
          </button>

          <button
            v-for="tag in visibleTags"
            :key="tag"
            type="button"
            class="focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition"
            :class="activeTags.includes(tag) ? 'border-ink bg-ink text-paper' : 'border-line text-ink hover:border-ink/40'"
            @click="emit('toggle-tag', tag)"
          >
            {{ tag }}
          </button>
        </div>

        <div class="w-full max-w-xs">
          <label for="sort-by" class="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Sort
          </label>
          <select
            id="sort-by"
            class="focus-ring w-full border border-line bg-paper px-3 py-2 text-base text-ink"
            :value="sortBy"
            @change="emit('update-sort', $event.target.value)"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="a-z">Title (A-Z)</option>
            <option value="z-a">Title (Z-A)</option>
          </select>
        </div>
      </div>

      <div v-if="projects.length" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
          data-gallery-card
          @open="emit('open', $event)"
        />
      </div>

      <div
        v-if="projects.length"
        class="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4"
        data-reveal
      >
        <p class="text-base text-muted">Showing {{ showingCount }} of {{ totalCount }} works</p>
      </div>

      <div
        v-if="canLoadMore"
        ref="autoLoadSentinel"
        class="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4"
      >
        <p class="text-base text-muted">
          {{ isLoadPending ? 'Loading more works...' : 'Scroll down to auto-load more works.' }}
        </p>
        <button
          type="button"
          class="focus-ring border border-line px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-ink/40"
          @click="requestMore"
        >
          Load More Now
        </button>
      </div>

      <p v-else class="border border-dashed border-line p-6 text-center text-base text-muted" data-reveal>
        No projects match the current filter selection.
      </p>
    </div>
  </section>
</template>

<script setup>
import { nextTick, onUnmounted, ref, watch } from 'vue';
import { useScrollReveal } from '../../composables/useScrollReveal';
import { gsap } from '../../utils/gsap';
import ProjectCard from '../ui/ProjectCard.vue';
import SectionHeading from '../ui/SectionHeading.vue';

const props = defineProps({
  activeTags: {
    type: Array,
    default: () => []
  },
  canLoadMore: {
    type: Boolean,
    default: false
  },
  projects: {
    type: Array,
    default: () => []
  },
  showingCount: {
    type: Number,
    default: 0
  },
  sortBy: {
    type: String,
    default: 'newest'
  },
  totalCount: {
    type: Number,
    default: 0
  },
  visibleTags: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['load-more', 'open', 'toggle-tag', 'update-sort']);

const root = ref(null);
const autoLoadSentinel = ref(null);
const isLoadPending = ref(false);

let autoLoadObserver = null;
let releasePendingTimer = null;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function requestMore() {
  if (!props.canLoadMore || isLoadPending.value) return;
  isLoadPending.value = true;
  emit('load-more');

  if (releasePendingTimer) {
    window.clearTimeout(releasePendingTimer);
  }
  releasePendingTimer = window.setTimeout(() => {
    isLoadPending.value = false;
  }, 320);
}

function setupAutoLoadObserver() {
  autoLoadObserver?.disconnect();
  autoLoadObserver = null;

  if (!autoLoadSentinel.value || !props.canLoadMore) return;

  autoLoadObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestMore();
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px 300px 0px',
      threshold: 0.01
    }
  );

  autoLoadObserver.observe(autoLoadSentinel.value);
}

function animateGalleryCards(fromIndex = 0) {
  if (prefersReducedMotion() || !root.value) return;

  const cards = gsap.utils.toArray(root.value.querySelectorAll('[data-gallery-card]'));
  const targets = cards.slice(fromIndex);

  if (!targets.length) return;

  gsap.killTweensOf(targets);
  gsap.fromTo(
    targets,
    {
      autoAlpha: 0,
      y: 20
    },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.045,
      ease: 'power2.out',
      clearProps: 'opacity,transform'
    }
  );
}

useScrollReveal(root);

watch(
  () => props.canLoadMore,
  async () => {
    await nextTick();
    setupAutoLoadObserver();
    if (!props.canLoadMore) {
      isLoadPending.value = false;
    }
  },
  { immediate: true }
);

watch(
  () => props.showingCount,
  async (newCount, oldCount) => {
    await nextTick();

    const previousCount = Math.max(oldCount || 0, 0);
    const startIndex = newCount > previousCount ? previousCount : 0;
    animateGalleryCards(startIndex);
  },
  { immediate: true }
);

onUnmounted(() => {
  autoLoadObserver?.disconnect();
  if (releasePendingTimer) {
    window.clearTimeout(releasePendingTimer);
  }
});
</script>

