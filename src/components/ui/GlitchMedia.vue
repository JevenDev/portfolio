<template>
  <figure class="project-media" :class="[`project-media--${fit}`, `project-media--${treatment}`]">
    <img
      :src="src"
      :alt="alt"
      :fetchpriority="priority"
      :loading="loading"
      decoding="async"
    />
  </figure>
</template>

<script setup>
const props = defineProps({
  alt: { type: String, default: '' },
  eager: { type: Boolean, default: false },
  fit: { type: String, default: 'cover' },
  resolve: { type: Boolean, default: true },
  signal: { type: [String, Number], default: '' },
  src: { type: String, required: true },
  treatment: { type: String, default: 'preview' }
});

const loading = props.eager ? 'eager' : 'lazy';
const priority = props.eager ? 'high' : 'auto';
</script>

<style scoped>
.project-media {
  height: 100%;
  min-height: inherit;
  margin: 0;
  overflow: hidden;
  background: #deddd7;
}

.project-media img {
  width: 100%;
  height: 100%;
  transition: filter 180ms ease, opacity 180ms ease;
}

.project-media--cover img {
  object-fit: cover;
}

.project-media--contain img {
  object-fit: contain;
}

.project-media--preview img {
  filter: saturate(0.78) contrast(1.04);
}

:global(a:hover .project-media--preview img),
:global(a:focus-visible .project-media--preview img) {
  filter: saturate(1) contrast(1);
}
</style>
