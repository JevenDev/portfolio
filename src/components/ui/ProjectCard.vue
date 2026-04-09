<template>
  <article class="project-card group frame-block flex h-full flex-col transition duration-300 hover:border-ink/30">
    <button
      type="button"
      class="focus-ring block text-left"
      :aria-label="`Open details for ${project.title}`"
      @click="$emit('open', project)"
    >
      <figure class="overflow-hidden border-b border-line bg-shell">
        <img
          :src="project.thumbCard || project.thumb"
          :alt="project.title"
          class="aspect-[5/4] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          decoding="async"
          fetchpriority="low"
          loading="lazy"
          draggable="false"
        />
      </figure>

      <div class="space-y-3 p-5">
        <div class="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          <span>{{ project.year }}</span>
          <span class="text-line">/</span>
          <span>{{ getFallbackTypeLabel(project) }}</span>
        </div>

        <h3 class="font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-ink">
          {{ project.title }}
        </h3>

        <p v-if="project.role" class="text-base font-medium text-muted">{{ project.role }}</p>

        <ul class="flex flex-wrap gap-2">
          <li
            v-for="tag in getVisibleTags(project)"
            :key="`${project.id}-${tag}`"
            class="rounded-full border border-line px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted"
          >
            {{ tag }}
          </li>
          <li
            v-if="getHiddenTagCount(project) > 0"
            :aria-label="`Hidden tags: ${getHiddenTagsTooltip(project)}`"
            class="tag-overflow-chip rounded-full border border-line px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted"
          >
            +{{ getHiddenTagCount(project) }}
            <span
              class="tag-overflow-tooltip pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 w-max max-w-[16rem] -translate-x-1/2 whitespace-normal rounded border border-line bg-paper px-2 py-1 text-[11px] font-medium normal-case tracking-normal text-ink shadow-sm"
            >
              {{ getHiddenTagsTooltip(project) }}
            </span>
          </li>
        </ul>
      </div>
    </button>
  </article>
</template>

<script setup>
import { getProjectTypeLabels } from '../../utils/portfolio';

const MAX_VISIBLE_TAGS = 4;

function getFallbackTypeLabel(project) {
  const labels = getProjectTypeLabels(project);
  if (labels.length) return labels.join(' / ');
  if (project.cardTypeLabel) return project.cardTypeLabel;
  return 'Project';
}

function getVisibleTags(project) {
  return project?.tags?.slice(0, MAX_VISIBLE_TAGS) || [];
}

function getHiddenTagCount(project) {
  return getHiddenTags(project).length;
}

function getHiddenTags(project) {
  const tags = project?.tags || [];
  return tags.slice(getVisibleTags(project).length);
}

function getHiddenTagsTooltip(project) {
  return getHiddenTags(project).join(", ");
}

defineProps({
  project: {
    type: Object,
    required: true
  }
});

defineEmits(['open']);
</script>

<style scoped>
.project-card {
  position: relative;
  overflow: visible;
}

.tag-overflow-chip {
  position: relative;
}

.tag-overflow-tooltip {
  opacity: 0;
  transform: translate(-50%, 2px);
  transition: opacity 140ms ease, transform 140ms ease;
  visibility: hidden;
}

.tag-overflow-chip:hover .tag-overflow-tooltip,
.tag-overflow-chip:focus-within .tag-overflow-tooltip,
.tag-overflow-chip:focus-visible .tag-overflow-tooltip {
  opacity: 1;
  transform: translate(-50%, 0);
  visibility: visible;
}
</style>


