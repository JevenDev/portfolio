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
          :src="project.thumb"
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
          <span>{{ project.type === 'artwork' ? 'Artwork' : 'Project' }}</span>
        </div>

        <h3 class="font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-ink">
          {{ project.title }}
        </h3>

        <p v-if="project.role" class="text-base font-medium text-muted">{{ project.role }}</p>

        <ul class="flex flex-wrap gap-2">
          <li
            v-for="tag in project.tags?.slice(0, 4)"
            :key="`${project.id}-${tag}`"
            class="rounded-full border border-line px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted"
          >
            {{ tag }}
          </li>
        </ul>
      </div>
    </button>
  </article>
</template>

<script setup>
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
  content-visibility: auto;
  contain-intrinsic-size: 420px;
}
</style>

