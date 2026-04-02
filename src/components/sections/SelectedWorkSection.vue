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
                :src="featuredProject.thumbCard || featuredProject.thumb"
                :alt="featuredProject.title"
                class="aspect-[4/3] h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                fetchpriority="low"
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
                    v-for="tag in getFeaturedTags(featuredProject)"
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
                :src="project.thumbCard || project.thumb"
                :alt="project.title"
                class="aspect-[5/4] w-full border-b border-line object-cover transition duration-500 group-hover:scale-[1.015]"
                fetchpriority="low"
                loading="lazy"
                decoding="async"
              />
              <div class="space-y-3 p-5">
                <p class="text-xs font-semibold uppercase tracking-[0.15em] text-muted">{{ project.year }}</p>
                <h4 class="font-display text-2xl font-semibold leading-[1.12] tracking-[-0.02em] text-ink">
                  {{ project.title }}
                </h4>
                <p class="text-base text-muted">{{ project.role || 'Graphic Design Piece' }}</p>
                <ul
                  v-if="project.tags?.length"
                  :ref="(el) => setSecondaryTagListRef(project.id, el)"
                  class="flex h-[4.1rem] flex-wrap content-start gap-2 overflow-hidden"
                >
                  <li
                    v-for="tag in getSecondaryTags(project)"
                    :key="`${project.id}-${tag}`"
                    :title="tag"
                    class="max-w-full truncate whitespace-nowrap rounded-full border border-line px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted"
                  >
                    {{ tag }}
                  </li>
                  <li
                    v-if="getSecondaryHiddenTagCount(project) > 0"
                    class="max-w-full truncate whitespace-nowrap rounded-full border border-line px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted"
                  >
                    +{{ getSecondaryHiddenTagCount(project) }}
                  </li>
                </ul>
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
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
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
const secondaryTagVisibleCountById = reactive({});
const secondaryTagListRefs = new Map();

const MAX_SECONDARY_TAG_ROWS = 2;
const secondaryTagChipClasses =
  'max-w-full truncate whitespace-nowrap rounded-full border border-line px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted';

let resizeObserver;
let measureRoot;
let recalcRaf = null;

function getFeaturedTags(project) {
  return project?.tags?.slice(0, 20) || [];
}

function getSecondaryTags(project) {
  const tags = project?.tags || [];
  const visibleCount = secondaryTagVisibleCountById[project?.id];
  const fallbackCount = Math.min(tags.length, 5);
  const count = Number.isInteger(visibleCount) ? visibleCount : fallbackCount;
  return tags.slice(0, count);
}

function getSecondaryHiddenTagCount(project) {
  const total = project?.tags?.length || 0;
  return Math.max(0, total - getSecondaryTags(project).length);
}

function ensureMeasureRoot() {
  if (measureRoot) return measureRoot;

  const rootElement = document.createElement('div');
  rootElement.style.position = 'fixed';
  rootElement.style.left = '-10000px';
  rootElement.style.top = '-10000px';
  rootElement.style.visibility = 'hidden';
  rootElement.style.pointerEvents = 'none';
  rootElement.style.zIndex = '-1';
  document.body.appendChild(rootElement);
  measureRoot = rootElement;
  return measureRoot;
}

function createMeasureChip(label) {
  const chip = document.createElement('li');
  chip.className = secondaryTagChipClasses;
  chip.textContent = label;
  return chip;
}

function getRowCount(listElement) {
  const rows = new Set();

  Array.from(listElement.children).forEach((chip) => {
    rows.add(chip.offsetTop);
  });

  return rows.size;
}

function calculateVisibleTagCount(project, containerElement) {
  const tags = project?.tags || [];
  if (!tags.length || !containerElement) return 0;

  const containerWidth = Math.floor(containerElement.clientWidth);
  if (containerWidth <= 0) return Math.min(tags.length, 5);

  const rootElement = ensureMeasureRoot();
  const listElement = document.createElement('ul');
  listElement.className = 'flex flex-wrap content-start gap-2';
  listElement.style.width = `${containerWidth}px`;
  listElement.style.margin = '0';
  listElement.style.padding = '0';
  listElement.style.listStyle = 'none';
  rootElement.appendChild(listElement);

  let visibleCount = 0;

  for (let count = tags.length; count >= 0; count -= 1) {
    listElement.replaceChildren();

    tags.slice(0, count).forEach((tag) => {
      listElement.appendChild(createMeasureChip(tag));
    });

    if (count < tags.length) {
      listElement.appendChild(createMeasureChip(`+${tags.length - count}`));
    }

    if (getRowCount(listElement) <= MAX_SECONDARY_TAG_ROWS) {
      visibleCount = count;
      break;
    }
  }

  rootElement.removeChild(listElement);
  return visibleCount;
}

function recalculateSecondaryTagVisibility() {
  secondaryProjects.value.forEach((project) => {
    const containerElement = secondaryTagListRefs.get(project.id);
    secondaryTagVisibleCountById[project.id] = calculateVisibleTagCount(project, containerElement);
  });
}

function scheduleSecondaryTagRecalculation() {
  if (recalcRaf !== null) {
    window.cancelAnimationFrame(recalcRaf);
  }

  recalcRaf = window.requestAnimationFrame(() => {
    recalcRaf = null;
    recalculateSecondaryTagVisibility();
  });
}

function observeSecondaryTagLists() {
  if (!resizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      scheduleSecondaryTagRecalculation();
    });
  } else {
    resizeObserver.disconnect();
  }

  secondaryTagListRefs.forEach((element) => {
    resizeObserver.observe(element);
  });
}

function setSecondaryTagListRef(projectId, element) {
  if (element) {
    secondaryTagListRefs.set(projectId, element);
    return;
  }

  secondaryTagListRefs.delete(projectId);
}

watch(
  secondaryProjects,
  async () => {
    await nextTick();
    observeSecondaryTagLists();
    scheduleSecondaryTagRecalculation();
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  scheduleSecondaryTagRecalculation();
});

onUnmounted(() => {
  if (recalcRaf !== null) {
    window.cancelAnimationFrame(recalcRaf);
  }

  resizeObserver?.disconnect();
  secondaryTagListRefs.clear();

  if (measureRoot?.parentNode) {
    measureRoot.parentNode.removeChild(measureRoot);
  }

  measureRoot = null;
  resizeObserver = null;
});
</script>
