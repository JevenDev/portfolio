<template>
  <main id="main-content" tabindex="-1" class="pt-14 md:pt-[5.5rem] focus-visible:outline-none">
    <WorkGallerySection
      :projects="visibleProjects"
      :active-tags="activeTags"
      :visible-tags="visibleTags"
      :sort-by="sortBy"
      :showing-count="visibleProjects.length"
      :total-count="projects.length"
      :can-load-more="canLoadMore"
      @toggle-tag="emit('toggle-tag', $event)"
      @update-sort="emit('update-sort', $event)"
      @load-more="loadMore"
      @open="emit('open-project', $event)"
    />
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import WorkGallerySection from '../components/sections/WorkGallerySection.vue';

const props = defineProps({
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

const PAGE_SIZE = 12;
const visibleCount = ref(PAGE_SIZE);

const visibleProjects = computed(() => props.projects.slice(0, visibleCount.value));
const canLoadMore = computed(() => visibleCount.value < props.projects.length);

function loadMore() {
  visibleCount.value = Math.min(visibleCount.value + PAGE_SIZE, props.projects.length);
}

watch(
  () => [props.projects, props.sortBy, props.activeTags.join('|')],
  () => {
    visibleCount.value = PAGE_SIZE;
  }
);

const emit = defineEmits(['open-project', 'toggle-tag', 'update-sort']);
</script>
