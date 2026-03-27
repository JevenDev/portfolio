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
            class="focus-ring rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition"
            :class="activeTags.length === 0 ? 'border-ink bg-ink text-paper' : 'border-line text-ink hover:border-ink/40'"
            @click="emit('toggle-tag', 'all')"
          >
            All Tags
          </button>

          <button
            v-for="tag in visibleTags"
            :key="tag"
            type="button"
            class="focus-ring rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition"
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
            class="focus-ring w-full border border-line bg-paper px-3 py-2 text-sm text-ink"
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
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" @open="emit('open', $event)" />
      </div>

      <p v-else class="border border-dashed border-line p-6 text-center text-sm text-muted" data-reveal>
        No projects match the current filter selection.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '../../composables/useScrollReveal';
import ProjectCard from '../ui/ProjectCard.vue';
import SectionHeading from '../ui/SectionHeading.vue';

defineProps({
  activeTags: {
    type: Array,
    default: () => []
  },
  projects: {
    type: Array,
    default: () => []
  },
  sortBy: {
    type: String,
    default: 'newest'
  },
  visibleTags: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['open', 'toggle-tag', 'update-sort']);

const root = ref(null);
useScrollReveal(root);
</script>